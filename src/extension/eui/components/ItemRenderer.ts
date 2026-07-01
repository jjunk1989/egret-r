// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { TouchEvent } from "../../../egret/events/TouchEvent";
import { Event } from "../../../egret/events/Event";
import { Component } from "./Component";
import { IItemRenderer } from "../core/IItemRenderer";
import { registerBindable } from "../utils/registerBindable";
import { PropertyEvent } from "../events/PropertyEvent";


    /**
     * The ItemRenderer class is the base class for item renderers.
     *
     * @state up Up state
     * @state down Down state
     * @state upAndSelected Up state when the button is selected
     * @state downAndSelected Down state when the button is selected
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @includeExample  extension/eui/components/ItemRendererExample.ts
     * @language en_US
     */
    /**
     * ItemRenderer 类是项呈示器的基类。
     *
     * @state up 弹起状态
     * @state down 按下状态
     * @state upAndSelected 选择时的弹起状态
     * @state downAndSelected 选择时的按下状态
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @includeExample  extension/eui/components/ItemRendererExample.ts
     * @language zh_CN
     */
    export class ItemRenderer extends Component implements IItemRenderer {

        /**
         * Constructor.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 构造函数。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public constructor() {
            super();
            this.addEventListener(TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        }

        /**
         * @private
         */
        private _data: any = null;
        /**
         * The data to render or edit.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 要呈示或编辑的数据。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public get data(): any {
            return this._data;
        }

        public set data(value: any) {
            this._data = value;
            PropertyEvent.dispatchPropertyEvent(this, PropertyEvent.PROPERTY_CHANGE, "data");
            this.dataChanged();
        }

        /**
         * Update the view when the <code>data</code> property changes.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 当数据改变时，更新视图。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        protected dataChanged(): void {

        }

        /**
         * @private
         */
        private _selected: boolean = false;
        /**
         * Contains <code>true</code> if the item renderer
         * can show itself as selected.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 如果项呈示器可以将其自身显示为已选中，则为 true。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public get selected(): boolean {
            return this._selected;
        }

        public set selected(value: boolean) {
            if (this._selected == value)
                return;
            this._selected = value;
            this.invalidateState();
        }

        /**
         * The index of the item in the data provider
         * of the host component of the item renderer.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 项呈示器的数据提供程序中的项目索引。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public itemIndex: number = -1;

        /**
         * @private
         * 指示第一次分派 TouchEvent.TOUCH_BEGIN 时，触摸点是否在按钮上。
         */
        private touchCaptured: boolean = false;
        /**
         * Dispatched when an event of some kind occurred that canceled the touch.
         * @version Egret 3.0.1
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 由于某个事件取消了触摸时触发
         * @version Egret 3.0.1
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        protected onTouchCancle(event: TouchEvent): void {
            this.touchCaptured = false;
            let stage = event.$currentTarget;
            stage.removeEventListener(TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
            stage.removeEventListener(TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
            this.invalidateState();
        }

        /**
         * Handles <code>TouchEvent.TOUCH_BEGIN</code> events
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 触碰开始时触发事件
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        protected onTouchBegin(event: TouchEvent): void {
            if(!this.$stage) {
                return;
            }
            this.$stage.addEventListener(TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
            this.$stage.addEventListener(TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
            this.touchCaptured = true;
            this.invalidateState();
            event.updateAfterEvent();
        }
        /**
         * @private
         * 舞台上触摸弹起事件
         */
        private onStageTouchEnd(event: Event): void {
            let stage = event.$currentTarget;
            stage.removeEventListener(TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
            stage.removeEventListener(TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
            this.touchCaptured = false;
            this.invalidateState();
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected getCurrentState(): string {
            let state = "up";
            if (!this.enabled) {
                state = "disabled";
            }
            if (this.touchCaptured) {
                state = "down";
            }
            if (this._selected) {
                let selectedState = state + "AndSelected";
                let skin = this.skin;
                if (skin && skin.hasState(selectedState)) {
                    return selectedState;
                }
                return state == "disabled" ? "disabled" : "down";
            }
            return state;
        }
    }

    registerBindable(ItemRenderer.prototype, "data");