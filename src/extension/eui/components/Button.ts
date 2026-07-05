// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


import { egret } from '@egret-r/core';
const { TouchEvent, Texture, Event } = egret;
import { Component } from "./Component";
import { IDisplayText } from "../core/IDisplayText";
import { Image } from "./Image";

    /**
     * The Button component is a commonly used rectangular button.
     * The Button component looks like it can be pressed.
     * The default skin has a text label and a icon display object.
     *
     * @event TouchEvent.TOUCH_CANCEL canceled the touch
     *
     * @state up Button up state
     * @state down Button down state
     * @state disabled Button disabled state
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @includeExample extension/eui/components/ButtonExample.ts
     * @language en_US
     */
    /**
     * Button 组件是常用的矩形按钮。Button 组件看起来可以按压。默认外观具有一个文本标签和图标显示对象。
     *
     * @event TouchEvent.TOUCH_CANCEL 取消触摸事件
     *
     * @state up 按钮弹起状态
     * @state down 按钮按下状态
     * @state disabled 按钮禁用状态
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @includeExample extension/eui/components/ButtonExample.ts
     * @language zh_CN
     */
    export class Button extends Component {
        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 创建一个按钮实例
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public constructor() {
            super();
            this.touchChildren = false;
            this.addEventListener(TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        }

        /**
         * [SkinPart] A skin part that defines the label of the button.
         * @skinPart
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * [SkinPart] 按钮上的文本标签。
         * @skinPart
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public labelDisplay:IDisplayText = null;

        /**
         * @private
         */
        private _label:string = "";
        /**
         * Text to appear on the Button control.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 要在按钮上显示的文本。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public get label():string {
            return this._label;
        }

        public set label(value:string) {
            this._label = value;
            if (this.labelDisplay) {
                this.labelDisplay.text = value;
            }
        }

        /**
         * [SkinPart] A skin part that defines an optional icon for the button.
         * @skinPart
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * [SkinPart] 按钮上的图标显示对象。
         * @skinPart
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public iconDisplay:Image = null;

        /**
         * @private
         */
        private _icon:string|Texture = null;
        /**
         * Icon to appear on the Button control.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 要在按钮上显示的图标数据
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public get icon():string|Texture {
            return this._icon;
        }

        public set icon(value:string|Texture) {
            this._icon = value;
            if (this.iconDisplay) {
                this.iconDisplay.source = value;
            }
        }

        /**
         * @private
         * 指示第一次分派 TouchEvent.TOUCH_BEGIN 时，触摸点是否在按钮上。
         */
        private touchCaptured:boolean = false;
        /**
         * This method handles the touchCancle events
         * @param  The <code>TouchEvent</code> object.
         * @version Egret 3.0.1
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 解除触碰事件处理。
         * @param event 事件 <code>TouchEvent</code> 的对象。
         * @version Egret 3.0.1
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        protected onTouchCancle(event:TouchEvent):void {
            let stage = event.$currentTarget;
            stage.removeEventListener(TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
            stage.removeEventListener(TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
            this.touchCaptured = false;
            this.invalidateState();
        }
        /**
         * This method handles the touch events
         * @param  The <code>TouchEvent</code> object.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 触碰事件处理。
         * @param event 事件 <code>TouchEvent</code> 的对象。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        protected onTouchBegin(event:TouchEvent):void {
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
        private onStageTouchEnd(event:Event):void {
            let stage = event.$currentTarget;
            stage.removeEventListener(TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
            stage.removeEventListener(TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
            if (this.contains(event.target)){
                this.buttonReleased();
            }
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
        protected getCurrentState():string {
            if (!this.enabled)
                return "disabled";

            if (this.touchCaptured)
                return "down";

            return "up";
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected partAdded(partName:string, instance:any):void {
            if (instance === this.labelDisplay) {
                this.labelDisplay.text = this._label;
            }
            else if (instance == this.iconDisplay) {
                this.iconDisplay.source = this._icon;
            }
        }

        /**
         * This method is called when handling a <code>TouchEvent.TOUCH_END</code> event
         * when the user touches on the button. It is only called when the button
         * is the target and when <code>touchCaptured</code> is <code>true</code>.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 当在用户单击按钮之后处理 <code>TouchEvent.TOUCH_END</code> 事件时，将调用此方法。
         * 仅当以按钮为目标，并且 <code>touchCaptured</code> 为 <code>true</code> 时，才会调用此方法。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        protected buttonReleased():void {
        }
    }