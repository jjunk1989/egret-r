// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { registerProperty } from "../utils/registerProperty";

import { TouchEvent } from "../../../egret/events/TouchEvent";
import { DisplayObject } from "../../../egret/display/DisplayObject";
import { UIEvent } from "../events/UIEvent";
import { Component } from "./Component";
import { Button } from "./Button";
import { IDisplayText } from "../core/IDisplayText";


    /**
     * The Panel class defines a container that includes a title bar,
     * a closeButton, a moveArea, and a content area for its children.
     *
     * @event UIEvent.CLOSING Dispatched when the close button is taped
     * you can use <code>event.preventDefault()</code> to prevent close.
     *
     * @defaultProperty elementsContent
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @includeExample  extension/eui/components/PanelExample.ts
     * @language en_US
     */
    /**
     * Panel 类定义一个容器，该容器为其子代提供标题栏、关闭按钮、可移动区域和内容区域。
     *
     * @event UIEvent.CLOSING 面板即将关闭事件，在关闭按钮被点击后抛出，
     * 监听此事件并调用<code>event.preventDefault()</code>能够阻止面板被关闭。
     *
     * @defaultProperty elementsContent
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @includeExample  extension/eui/components/PanelExample.ts
     * @language zh_CN
     */
    export class Panel extends Component {

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
            this.addEventListener(TouchEvent.TOUCH_BEGIN, this.onWindowTouchBegin, this, false, 100);
        }

        /**
         * @private
         * 在窗体上按下时前置窗口
         */
        private onWindowTouchBegin(event:TouchEvent):void {
            this.$parent.addChild(this);
        }


        /**
         * write-only property,This property is Usually invoked in resolving an EXML for adding multiple children quickly.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 只写属性，此属性通常在 EXML 的解析器中调用，便于快速添加多个子项。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public set elementsContent(value:DisplayObject[]) {
            if (value) {
                let length = value.length;
                for (let i = 0; i < length; i++) {
                    this.addChild(value[i]);
                }
            }
        }

        /**
         * The skin part that defines the appearance of the close button.
         * When taped, the close button dispatches a <code>closing</code> event.
         *
         * @skinPart
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 关闭按钮
         *
         * @skinPart
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public closeButton:Button = null;

        /**
         * The area where the user must drag to move the window.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 可移动区域
         *
         * @skinPart
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public moveArea:DisplayObject = null;

        /**
         * The skin part that defines the appearance of the
         * title text in the container.
         *
         * @skinPart
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 标题显示对象
         *
         * @skinPart
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public titleDisplay:IDisplayText = null;

        /**
         * @private
         */
        private _title:string = "";

        /**
         * Title or caption displayed in the title bar.
         *
         * @default ""
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 标题栏中显示的标题。
         *
         * @default ""
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public get title():string {
            return this._title;
        }

        public set title(value:string) {
            this._title = value;
            if (this.titleDisplay)
                this.titleDisplay.text = this.title;
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected partAdded(partName:string, instance:any):void {
            super.partAdded(partName, instance);
            if (instance == this.titleDisplay) {
                this.titleDisplay.text = this._title;
            }
            else if (instance == this.moveArea) {
                this.moveArea.addEventListener(TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            }
            else if (instance == this.closeButton) {
                this.closeButton.addEventListener(TouchEvent.TOUCH_TAP, this.onCloseButtonClick, this);
            }
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected partRemoved(partName:string, instance:any):void {
            super.partRemoved(partName, instance);
            if (instance == this.moveArea) {
                this.moveArea.removeEventListener(TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            }
            else if (instance == this.closeButton) {
                this.closeButton.removeEventListener(TouchEvent.TOUCH_TAP, this.onCloseButtonClick, this);
            }
        }

        /**
         * Dispatch the "closing" event when the closeButton is clicked.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 当 closeButton 被点击时派发 “closing” 事件
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        protected onCloseButtonClick(event:TouchEvent):void {
            if (UIEvent.dispatchUIEvent(this, UIEvent.CLOSING, true, true)) {
                this.close();
            }
        }

        /**
         * Close the panel and remove from the parent container.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 关闭面板，从父级容器移除自身。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public close():void {
            if (!this.$parent) {
                return;
            }
            this.$parent.removeChild(this);
        }

        /**
         * @private
         * 触摸按下时的偏移量
         */
        private offsetPointX:number = 0;
        /**
         * @private
         */
        private offsetPointY:number = 0;

        /**
         * Called when the user starts dragging a Panel.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 在可移动区域按下
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        protected onTouchBegin(event:TouchEvent):void {
            this.$includeInLayout = false;
            this.offsetPointX = this.x - event.$stageX;
            this.offsetPointY = this.y - event.$stageY;
            this.$stage.addEventListener(TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            this.$stage.addEventListener(TouchEvent.TOUCH_END, this.onTouchEnd, this);
        }

        /**
         * Called when the user drags a Panel.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 触摸拖拽时的移动事件
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        protected onTouchMove(event:TouchEvent):void {
            this.x = event.$stageX + this.offsetPointX;
            this.y = event.$stageY + this.offsetPointY;
        }

        /**
         * Called when the user releases the Panel.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 在舞台上弹起事件
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        protected onTouchEnd(event:TouchEvent):void {
            let stage = event.$currentTarget;
            stage.removeEventListener(TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            stage.removeEventListener(TouchEvent.TOUCH_END, this.onTouchEnd, this);
        }
    }

    registerProperty(Panel, "elementsContent", "Array", true);