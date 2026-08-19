// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { StageText } from "./StageText";
import { TouchEvent } from "../events/TouchEvent";
import { FocusEvent } from "../events/FocusEvent";
import type { TextField } from "./TextField";
import { Stage } from "../display/Stage";
import { callLater } from "../utils/callLater";

import { Event } from "../events/Event";
import { TextKeys } from "./TextField";
import { HashObject } from "../utils/HashObject";

    /**
     * @private
     * @version Egret 2.4
     * @platform Web
     */
    export class InputController extends HashObject {
        /**
         * @private
         */
        public stageText: StageText;

        /**
         * @private
         */
        private stageTextAdded: boolean = false;

        /**
         * @private
         */
        private _text: TextField = null;

        /**
         * @private
         */
        private _isFocus: boolean = false;
        /**
         * @version Egret 2.4
         * @platform Web
         */
        public constructor() {
            super();
        }

        /**
         * 
         * @param text 
         * @version Egret 2.4
         * @platform Web
         */
        public init(text: TextField): void {
            this._text = text;
            this.stageText = new StageText();
            this.stageText.$setTextField(this._text);
        }

        /**
         * @private
         * 
         */
        public _addStageText(): void {
            if (this.stageTextAdded) {
                return;
            }
            if (!this._text.$inputEnabled) {
                this._text.$touchEnabled = true;
            }

            this.tempStage = this._text.stage;

            this.stageText.$addToStage();

            this.stageText.addEventListener("updateText", this.updateTextHandler, this);
            this._text.addEventListener(TouchEvent.TOUCH_BEGIN, this.onMouseDownHandler, this);
            this._text.addEventListener(TouchEvent.TOUCH_MOVE, this.onMouseMoveHandler, this);

            this.stageText.addEventListener("blur", this.blurHandler, this);
            this.stageText.addEventListener("focus", this.focusHandler, this);

            this.stageTextAdded = true;
        }

        /**
         * @private
         * 
         */
        public _removeStageText(): void {
            if (!this.stageTextAdded) {
                return;
            }
            if (!this._text.$inputEnabled) {
                this._text.$touchEnabled = false;
            }

            this.stageText.$removeFromStage();

            this.stageText.removeEventListener("updateText", this.updateTextHandler, this);
            this._text.removeEventListener(TouchEvent.TOUCH_BEGIN, this.onMouseDownHandler, this);
            this._text.addEventListener(TouchEvent.TOUCH_MOVE, this.onMouseMoveHandler, this);
            this.tempStage.removeEventListener(TouchEvent.TOUCH_BEGIN, this.onStageDownHandler, this);

            this.stageText.removeEventListener("blur", this.blurHandler, this);
            this.stageText.removeEventListener("focus", this.focusHandler, this);


            if (this._isFocus) {
                this._isFocus = false;
                this._text.$setIsTyping(false);
            }

            this.stageTextAdded = false;
        }

        /**
         * @private
         * 
         * @returns 
         */
        public _getText(): string {
            return this.stageText.$getText();
        }

        /**
         * @private
         * 
         * @param value 
         */
        public _setText(value: string) {
            this.stageText.$setText(value);
        }
        /**
         * @private
         */
        public _setColor(value: number) {
            this.stageText.$setColor(value);
        }

        /**
         * @private
         * 
         * @param event 
         */
        private focusHandler(event: Event): void {
            //不再显示竖线，并且输入框显示最开始
            if (!this._isFocus) {
                this._isFocus = true;
                if (!event["showing"]) {
                    this._text.$setIsTyping(true);
                }

                this._text.dispatchEvent(new FocusEvent(FocusEvent.FOCUS_IN, true));
            }
        }

        /**
         * @private
         * 
         * @param event 
         */
        private blurHandler(event: Event): void {
            if (this._isFocus) {
                //不再显示竖线，并且输入框显示最开始
                this._isFocus = false;
                this.tempStage.removeEventListener(TouchEvent.TOUCH_BEGIN, this.onStageDownHandler, this);

                this._text.$setIsTyping(false);
                //失去焦点后调用
                this.stageText.$onBlur();

                this._text.dispatchEvent(new FocusEvent(FocusEvent.FOCUS_OUT, true));
            }
        }

        private tempStage: Stage;
        //点中文本
        private onMouseDownHandler(event: TouchEvent) {
            this.$onFocus();
        }

        private onMouseMoveHandler(event: TouchEvent) {
            this.stageText.$hide();
        }

        $onFocus(active: boolean = false): void {
            if (!this._text.visible) {
                return;
            }

            if (this._isFocus) {
                return;
            }

            this.tempStage.removeEventListener(TouchEvent.TOUCH_BEGIN, this.onStageDownHandler, this);
            callLater(() => {
                this.tempStage.addEventListener(TouchEvent.TOUCH_BEGIN, this.onStageDownHandler, this);
            }, this);

            if (nativeRender) {
                this.stageText.$setText(this._text.$TextField[TextKeys.text]);
            }

            //强制更新输入框位置
            this.stageText.$show(active);
        }

        //未点中文本
        private onStageDownHandler(event: TouchEvent) {
            if (event.$target != this._text) {
                this.stageText.$hide();
            }
        }

        /**
         * @private
         * 
         * @param event 
         */
        private updateTextHandler(event: Event): void {
            let values = this._text.$TextField;
            let textValue = this.stageText.$getText();
            let isChanged: boolean = false;
            let reg: RegExp;
            let result: string[];
            if (values[TextKeys.restrictAnd] != null) {//内匹配
                reg = new RegExp("[" + values[TextKeys.restrictAnd] + "]", "g");
                result = textValue.match(reg);
                if (result) {
                    textValue = result.join("");
                }
                else {
                    textValue = "";
                }
                isChanged = true;
            }
            if (values[TextKeys.restrictNot] != null) {//外匹配
                reg = new RegExp("[^" + values[TextKeys.restrictNot] + "]", "g");
                result = textValue.match(reg);
                if (result) {
                    textValue = result.join("");
                }
                else {
                    textValue = "";
                }
                isChanged = true;
            }

            if (isChanged && this.stageText.$getText() != textValue) {
                this.stageText.$setText(textValue);
            }
            this.resetText();

            //抛出change事件
            this._text.dispatchEvent(new Event(Event.CHANGE, true));
        }

        /**
         * @private
         * 
         */
        private resetText(): void {
            this._text.$setBaseText(this.stageText.$getText());
        }

        /**
         * @private
         * 
         */
        public _hideInput(): void {
            this.stageText.$removeFromStage();
        }

        /**
         * @private
         * 
         */
        private updateInput(): void {//
            if (!this._text.$visible && this.stageText) {
                this._hideInput();
            }
        }

        /**
         * @private
         * 
         */
        public _updateProperties(): void {
            if (this._isFocus) {
                //整体修改
                this.stageText.$resetStageText();
                this.updateInput();
                return;
            }

            this.stageText.$setText(this._text.$TextField[TextKeys.text]);

            //整体修改
            this.stageText.$resetStageText();

            this.updateInput();
        }
    }
