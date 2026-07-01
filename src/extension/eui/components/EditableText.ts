// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { TextField } from "../../../egret/text/TextField";
import { FocusEvent } from "../../../egret/events/FocusEvent";
import { TextKeys } from "../../../egret/text/TextField";
import { TextFieldType } from "../../../egret/text/TextFieldType";
import { Stage } from "../../../egret/display/Stage";
import { TouchEvent } from "../../../egret/events/TouchEvent";
import { Capabilities } from "../../../egret/system/Capabilities";
import { Rectangle } from "../../../egret/geom/Rectangle";
import { Component } from "./Component";
import { registerBindable } from "../utils/registerBindable";
import { UIComponentImpl, UIKeys, implementUIComponent, UIComponent } from "../core/UIComponent";
import { PropertyEvent } from "../events/PropertyEvent";

    /**
     * @private
     */
    export enum EditableTextKeys {
        promptText,
        textColorUser,
        asPassword
    }

    sys.EditableTextKeys = EditableTextKeys;

    let UIImpl = UIComponentImpl;

    /**
     * Editable text for displaying,
     * scrolling, selecting, and editing text.
     * @includeExample  extension/eui/components/EditablTextExample.ts
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 可编辑文本，用于显示、滚动、选择和编辑文本。
     * @includeExample  extension/eui/components/EditablTextExample.ts
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @language zh_CN
     */
    export class EditableText extends TextField implements UIComponent, IDisplayText {

        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 构造函数。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public constructor() {
            super();
            this.initializeUIValues();
            this.type = TextFieldType.INPUT;
            this.$EditableText = {
                0: null,         //promptText,
                1: 0xffffff,     //textColorUser,
                2: false         //asPassword
            }
        }
        $EditableText: Object;
        /**
         * @private
         *
         */
        $invalidateTextField(): void {
            super.$invalidateTextField();
            this.invalidateSize();
        }

        /**
         * @private
         *
         * @param value
         */
        $setWidth(value: number): boolean {
            let result1: boolean = super.$setWidth(value);
            let result2: boolean = UIImpl.prototype.$setWidth.call(this, value);
            return result1 && result2;
        }

        /**
         * @private
         *
         * @param value
         */
        $setHeight(value: number): boolean {
            let result1: boolean = super.$setHeight(value);
            let result2: boolean = UIImpl.prototype.$setHeight.call(this, value);
            return result1 && result2;
        }
        /**
         * @private
         *
         * @param value
         */
        $getText(): string {
            let value = super.$getText();
            if (value == this.$EditableText[sys.EditableTextKeys.promptText]) {
                value = "";
            }
            return value;
        }
        /**
         * @private
         *
         * @param value
         */
        $setText(value: string): boolean {
            let promptText = this.$EditableText[sys.EditableTextKeys.promptText];
            if (promptText != value || promptText == null) {
                this.$isShowPrompt = false;
                this.textColor = this.$EditableText[sys.EditableTextKeys.textColorUser];
                this.displayAsPassword = this.$EditableText[sys.EditableTextKeys.asPassword];
            }
            if (!this.$isFocusIn) {
                if (value == "" || value == null) {
                    value = promptText;
                    this.$isShowPrompt = true;
                    super.$setTextColor(this.$promptColor);
                    super.$setDisplayAsPassword(false);
                }
            }
            let result: boolean = super.$setText(value);
            PropertyEvent.dispatchPropertyEvent(this, PropertyEvent.PROPERTY_CHANGE, "text");
            return result;
        }

        /**
         * @private
         */
        private _widthConstraint: number = NaN;
        /**
         * @private
         *
         * @param stage
         * @param nestLevel
         */
        public $onAddToStage(stage: Stage, nestLevel: number): void {
            UIComponentImpl.prototype["$onAddToStage"].call(this, stage, nestLevel);
            this.addEventListener(FocusEvent.FOCUS_IN, this.onfocusIn, this);
            this.addEventListener(FocusEvent.FOCUS_OUT, this.onfocusOut, this);
            this.addEventListener(TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            this.addEventListener(TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
        }
        /**
         * @private
         *
         */
        public $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
            this.removeEventListener(FocusEvent.FOCUS_IN, this.onfocusIn, this);
            this.removeEventListener(FocusEvent.FOCUS_OUT, this.onfocusOut, this);
            this.removeEventListener(TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            this.removeEventListener(TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
        }
        /**
         * @private
         */
        private $isShowPrompt: boolean = false;
        /**
         * When the property of the text is empty, it will show the defalut string.
         * @version Egret 2.5.5
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 当text属性为空字符串时要显示的文本内容。
         * 先创建文本控件时将显示提示文本。控件获得焦点时或控件的 text 属性为非空字符串时，提示文本将消失。
         * 控件失去焦点时提示文本将重新显示，但仅当未输入文本时（如果文本字段的值为空字符串）。<p/>
         * 对于文本控件，如果用户输入文本，但随后又将其删除，则控件失去焦点后，提示文本将重新显示。
         * 您还可以通过编程方式将文本控件的 text 属性设置为空字符串使提示文本重新显示。
         * @version Egret 2.5.5
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public get prompt(): string {
            return this.$EditableText[sys.EditableTextKeys.promptText];
        }
        public set prompt(value: string) {
            let values = this.$EditableText;
            let promptText = values[sys.EditableTextKeys.promptText];
            if (promptText == value)
                return;
            values[sys.EditableTextKeys.promptText] = value;
            let text = this.text;
            if (!text || text == promptText) {
                this.showPromptText();
            }
        }
        /**
         * @private
         */
        private $promptColor: number = 0x666666;
        /**
         * @private
         */
        private $isFocusIn: boolean = false;
        /**
         * The color of the defalut string.
         * @version Egret 2.5.5
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 默认文本的颜色
         * @version Egret 2.5.5
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public set promptColor(value: number) {
            value = +value | 0;
            if (this.$promptColor != value) {
                this.$promptColor = value;
                let text = this.text;
                if (!text || text == this.$EditableText[sys.EditableTextKeys.promptText]) {
                    this.showPromptText();
                }
            }
        }
        public get promptColor(): number {
            return this.$promptColor;
        }
        /**
         * @private
         */
        private onfocusOut(): void {
            this.$isFocusIn = false;
            if (!this.text) {
                this.showPromptText();
            }
        }
        /**
         * @private
         */
        private $isTouchCancle: boolean = false;
        /**
         * @private
         */
        private onTouchBegin(): void {
            this.$isTouchCancle = false;
        }
        /**
         * @private
         */
        private onTouchCancle(): void {
            this.$isTouchCancle = true;
        }
        /**
         * @private
         */
        private onfocusIn(): void {
            if (!Capabilities.isMobile && this.$isTouchCancle) {
                this.inputUtils.stageText.$hide();
                return
            }
            this.$isFocusIn = true;
            this.$isShowPrompt = false;
            this.displayAsPassword = this.$EditableText[sys.EditableTextKeys.asPassword];
            let values = this.$EditableText;
            let text = this.text;
            if (!text || text == values[sys.EditableTextKeys.promptText]) {
                this.textColor = values[sys.EditableTextKeys.textColorUser];
                this.text = "";
            }
        }
        /**
         * @private
         */
        private showPromptText(): void {
            let values = this.$EditableText;
            this.$isShowPrompt = true;
            super.$setTextColor(this.$promptColor);
            super.$setDisplayAsPassword(false);
            this.text = values[sys.EditableTextKeys.promptText];
        }
        /**
         * @private
         */
        $setTextColor(value: number): boolean {
            value = +value | 0;
            this.$EditableText[sys.EditableTextKeys.textColorUser] = value;
            if (!this.$isShowPrompt) {
                super.$setTextColor(value);
            }
            return true;
        }
        /**
         * @private
         */
        $setDisplayAsPassword(value: boolean): boolean {
            this.$EditableText[sys.EditableTextKeys.asPassword] = value;
            if (!this.$isShowPrompt) {
                super.$setDisplayAsPassword(value);
            }
            return true;
        }
        //=======================UIComponent接口实现===========================
        /**
         * @private
         * UIComponentImpl 定义的所有变量请不要添加任何初始值，必须统一在此处初始化。
         */
        private initializeUIValues: () => void;

        /**
         * @copy Component#createChildren()
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected createChildren(): void {
            this.onfocusOut();
        }

        /**
         * @copy Component#childrenCreated()
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected childrenCreated(): void {

        }

        /**
         * @copy Component#commitProperties()
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected commitProperties(): void {

        }

        /**
         * @copy Component#measure()
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected measure(): void {
            let values = this.$UIComponent;
            let textValues = this.$TextField;
            let oldWidth = textValues[TextKeys.textFieldWidth];
            let availableWidth = NaN;
            if (!isNaN(this._widthConstraint)) {
                availableWidth = this._widthConstraint;
                this._widthConstraint = NaN;
            }
            else if (!isNaN(values[UIKeys.explicitWidth])) {
                availableWidth = values[UIKeys.explicitWidth];
            }
            else if (values[UIKeys.maxWidth] != 100000) {
                availableWidth = values[UIKeys.maxWidth];
            }

            super.$setWidth(availableWidth);
            this.setMeasuredSize(this.textWidth, this.textHeight);
            super.$setWidth(oldWidth);
        }

        /**
         * @copy Component#updateDisplayList()
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected updateDisplayList(unscaledWidth: number, unscaledHeight: number): void {
            super.$setWidth(unscaledWidth);
            super.$setHeight(unscaledHeight);
        }

        /**
         * @copy Component#invalidateParentLayout()
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected invalidateParentLayout(): void {
        }

        /**
         * @private
         */
        $UIComponent: Object;

        /**
         * @private
         */
        $includeInLayout: boolean;

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public includeInLayout: boolean;
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public left: any;

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public right: any;

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public top: any;

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public bottom: any;

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public horizontalCenter: any;

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public verticalCenter: any;

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public percentWidth: number;

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public percentHeight: number;

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public explicitWidth: number;

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public explicitHeight: number;

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public minWidth: number;

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public maxWidth: number;

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public minHeight: number;

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public maxHeight: number;

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public setMeasuredSize(width: number, height: number): void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public invalidateProperties(): void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public validateProperties(): void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public invalidateSize(): void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public validateSize(recursive?: boolean): void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public invalidateDisplayList(): void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public validateDisplayList(): void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public validateNow(): void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public setLayoutBoundsSize(layoutWidth: number, layoutHeight: number): void {
            UIImpl.prototype.setLayoutBoundsSize.call(this, layoutWidth, layoutHeight);
            if (isNaN(layoutWidth) || layoutWidth === this._widthConstraint || layoutWidth == 0) {
                return;
            }
            let values = this.$UIComponent;
            if (!isNaN(values[UIKeys.explicitHeight])) {
                return;
            }
            if (layoutWidth == values[UIKeys.measuredWidth]) {
                return;
            }
            this._widthConstraint = layoutWidth;
            this.invalidateSize();
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public setLayoutBoundsPosition(x: number, y: number): void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public getLayoutBounds(bounds: Rectangle): void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public getPreferredBounds(bounds: Rectangle): void {
        }
    }

    implementUIComponent(EditableText, TextField);
    registerBindable(EditableText.prototype, "text");
