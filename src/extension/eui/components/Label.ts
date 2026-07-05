// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


import { egret } from '@egret-r/core';
const { TextField, getImplementation, Rectangle, TextKeys } = egret;
import { Theme } from "../core/Theme";
import { UIComponent, UIComponentImpl, UIKeys, implementUIComponent } from "../core/UIComponent";

import { registerBindable } from "../utils/registerBindable";
import { IDisplayText } from "../core/IDisplayText";
import { PropertyEvent } from "../events/PropertyEvent";

    let UIImpl = UIComponentImpl;
    /**
     * Label is an UIComponent that can render one or more lines of text.
     * The text to be displayed is determined by the <code>text</code> property.
     * The formatting of the text is specified by the styles，
     * such as <code>fontFamily</code> and <code>size</code>.
     *
     * <p>Because Label is fast and lightweight, it is especially suitable
     * for use cases that involve rendering many small pieces of non-interactive
     * text, such as item renderers and labels in Button skins.</p>
     *
     * <p>In Label, three character sequences are recognized
     * as explicit line breaks: CR (<code>"\r"</code>), LF (<code>"\n"</code>),
     * and CR+LF (<code>"\r\n"</code>).</p>
     *
     * <p>If you don't specify any kind of width for a Label,
     * then the longest line, as determined by these explicit line breaks,
     * determines the width of the Label.</p>
     *
     * <p>If you do specify some kind of width, then the specified text is
     * word-wrapped at the right edge of the component's bounds.
     * If the text extends below the bottom of the component,
     * it is clipped.</p>
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @includeExample  extension/eui/components/LabelExample.ts
     * @language en_US
     */
    /**
     * Label 是可以呈示一行或多行统一格式文本的UI组件。要显示的文本由 text 属性确定。文本格式由样式属性指定，例如 fontFamily 和 size。
     * 因为 Label 运行速度快且占用内存少，所以它特别适合用于显示多个小型非交互式文本的情况，例如，项呈示器和 Button 外观中的标签。
     * 在 Label 中，将以下三个字符序列识别为显式换行符：CR（“\r”）、LF（“\n”）和 CR+LF（“\r\n”）。
     * 如果没有为 Label 指定宽度，则由这些显式换行符确定的最长行确定 Label 的宽度。
     * 如果指定了宽度，则指定文本将在组件边界的右边缘换行，如果文本扩展到低于组件底部，则将被剪切。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @includeExample  extension/eui/components/LabelExample.ts
     * @language zh_CN
     */
    export class Label extends TextField implements UIComponent,IDisplayText {

        /**
         * Constructor.
         *
         * @param text The text displayed by this text component.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 构造函数。
         *
         * @param text 此文本组件所显示的文本。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public constructor(text?:string) {
            super();
            this.initializeUIValues();
            this.text = text;
        }

        /**
         * style中属性是否允许被赋值，当主动赋值过属性之后将不允许被赋值
         */
        private $styleSetMap = {
            "fontFamily": true,
            "size": true,
            "bold": true,
            "italic": true,
            "textAlign": true,
            "verticalAlign": true,
            "lineSpacing": true,
            "textColor": true,
            "wordWrap": true,
            "displayAsPassword": true,
            "strokeColor": true,
            "stroke": true,
            "maxChars": true,
            "multiline": true,
            "border": true,
            "borderColor": true,
            "background": true,
            "backgroundColor": true
        };
        private $revertStyle = {};
        private $style: string = null;

        private $changeFromStyle:boolean = false;

        /**
         * The style of text.
         * @version Egret 3.2.1
         * @platform Web
         * @language en_US
         */
        /**
         * 文本样式。
         * @version Egret 3.2.1
         * @platform Web
         * @language zh_CN
         */
        public get style(): string {
            return this.$style;
        }

        public set style(value: string) {
            this.$setStyle(value);
        }

        $setStyle(value: string) {
            if (this.$style == value) {
                return;
            }
            this.$style = value;
            let theme: Theme = getImplementation("Theme");
            if (theme) {
                this.$changeFromStyle = true;
                for (let key in this.$revertStyle) {
                    this[key] = this.$revertStyle[key];
                }
                this.$revertStyle = {};
                if (value == null) {
                    this.$changeFromStyle = false;
                    return;
                }
                let styleList = value.split(",");
                for (let i = 0; i < styleList.length; i++) {
                    let config = theme.$getStyleConfig(styleList[i]);
                    if (config) {
                        for (let key in config) {
                            if (this.$styleSetMap[key]) {
                                let revertValue = this[key];
                                this[key] = config[key];
                                this.$revertStyle[key] = revertValue;
                            }
                        }
                    }
                }
                this.$changeFromStyle = false;
            }
        }

        $setFontFamily(value: string): boolean {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["fontFamily"];
                this.$styleSetMap["fontFamily"] = false;
            }
            return super.$setFontFamily(value);
        }

        $setSize(value: number): boolean {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["size"];
                this.$styleSetMap["size"] = false;
            }
            return super.$setSize(value);
        }

        $setBold(value: boolean): boolean {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["bold"];
                this.$styleSetMap["bold"] = false;
            }
            return super.$setBold(value);
        }

        $setItalic(value: boolean): boolean {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["italic"];
                this.$styleSetMap["italic"] = false;
            }
            return super.$setItalic(value);
        }

        $setTextAlign(value: string): boolean {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["textAlign"];
                this.$styleSetMap["textAlign"] = false;
            }
            return super.$setTextAlign(value);
        }

        $setVerticalAlign(value: string): boolean {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["verticalAlign"];
                this.$styleSetMap["verticalAlign"] = false;
            }
            return super.$setVerticalAlign(value);
        }

        $setLineSpacing(value: number): boolean {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["lineSpacing"];
                this.$styleSetMap["lineSpacing"] = false;
            }
            return super.$setLineSpacing(value);
        }

        $setTextColor(value: number): boolean {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["textColor"];
                this.$styleSetMap["textColor"] = false;
            }
            return super.$setTextColor(value);
        }

        $setWordWrap(value: boolean): void {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["wordWrap"];
                this.$styleSetMap["wordWrap"] = false;
            }
            super.$setWordWrap(value);
        }

        $setDisplayAsPassword(value: boolean): boolean {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["displayAsPassword"];
                this.$styleSetMap["displayAsPassword"] = false;
            }
            return super.$setDisplayAsPassword(value);
        }

        $setStrokeColor(value: number): boolean {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["strokeColor"];
                this.$styleSetMap["strokeColor"] = false;
            }
            return super.$setStrokeColor(value);
        }

        $setStroke(value: number): boolean {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["stroke"];
                this.$styleSetMap["stroke"] = false;
            }
            return super.$setStroke(value);
        }

        $setMaxChars(value: number): boolean {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["maxChars"];
                this.$styleSetMap["maxChars"] = false;
            }
            return super.$setMaxChars(value);
        }

        $setMultiline(value: boolean): boolean {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["multiline"];
                this.$styleSetMap["multiline"] = false;
            }
            return super.$setMultiline(value);
        }

        $setBorder(value: boolean): void {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["border"];
                this.$styleSetMap["border"] = false;
            }
            super.$setBorder(value);
        }

        $setBorderColor(value: number): void {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["borderColor"];
                this.$styleSetMap["borderColor"] = false;
            }
            super.$setBorderColor(value);
        }

        $setBackground(value: boolean): void {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["background"];
                this.$styleSetMap["background"] = false;
            }
            super.$setBackground(value);
        }

        $setBackgroundColor(value: number): void {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["backgroundColor"];
                this.$styleSetMap["backgroundColor"] = false;
            }
            super.$setBackgroundColor(value);
        }

        /**
         * @private
         *
         */
        $invalidateTextField():void {
            super.$invalidateTextField();
            this.invalidateSize();
        }

        /**
         * @private
         *
         * @param value
         */
        $setWidth(value:number):boolean {
            let result1:boolean = super.$setWidth(value);
            let result2:boolean = UIImpl.prototype.$setWidth.call(this, value);
            return result1 && result2;
        }

        /**
         * @private
         *
         * @param value
         */
        $setHeight(value:number):boolean {
            let result1:boolean = super.$setHeight(value);
            let result2:boolean = UIImpl.prototype.$setHeight.call(this, value);
            return result1 && result2;
        }

        /**
         * @private
         *
         * @param value
         */
        $setText(value:string):boolean {
            let result:boolean = super.$setText(value);
            PropertyEvent.dispatchPropertyEvent(this, PropertyEvent.PROPERTY_CHANGE, "text");
            return result;
        }

        /**
         * @private
         */
        private _widthConstraint:number = NaN;

        //=======================UIComponent接口实现===========================
        /**
         * @private
         * UIComponentImpl 定义的所有变量请不要添加任何初始值，必须统一在此处初始化。
         */
        private initializeUIValues:()=>void;

        /**
         * @copy UIComponent#createChildren
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected createChildren():void {

        }

        /**
         * @copy UIComponent#childrenCreated
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected childrenCreated():void {

        }

        /**
         * @copy UIComponent#commitProperties
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected commitProperties():void {

        }
        /**
         * @copy UIComponent#measure
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected measure():void {
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
         * @copy UIComponent#updateDisplayList
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
            super.$setWidth(unscaledWidth);
            super.$setHeight(unscaledHeight);
        }

        /**
         * @copy UIComponent#invalidateParentLayout
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected invalidateParentLayout():void {
        }

        /**
         * @private
         */
        $UIComponent:Object;

        /**
         * @private
         */
        $includeInLayout:boolean;

        /**
         * @copy UIComponent#includeInLayout
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public includeInLayout:boolean;
        /**
         * @copy UIComponent#left
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public left:any;

        /**
         * @copy UIComponent#right
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public right:any;

        /**
         * @copy UIComponent#top
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public top:any;

        /**
         * @copy UIComponent#bottom
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public bottom:any;

        /**
         * @copy UIComponent#horizontalCenter
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public horizontalCenter:any;

        /**
         * @copy UIComponent#verticalCenter
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public verticalCenter:any;

        /**
         * @copy UIComponent#percentWidth
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public percentWidth:number;

        /**
         * @copy UIComponent#percentHeight
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public percentHeight:number;

        /**
         * @copy UIComponent#explicitWidth
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public explicitWidth:number;

        /**
         * @copy UIComponent#explicitHeight
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public explicitHeight:number;

        /**
         * @copy UIComponent#minWidth
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public minWidth:number;
        /**
         * @copy UIComponent#maxWidth
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public maxWidth:number;

        /**
         * @copy UIComponent#minHeight
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public minHeight:number;
        /**
         * @copy UIComponent#maxHeight
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public maxHeight:number;

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public setMeasuredSize(width:number, height:number):void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public invalidateProperties():void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public validateProperties():void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public invalidateSize():void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public validateSize(recursive?:boolean):void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public invalidateDisplayList():void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public validateDisplayList():void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public validateNow():void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public setLayoutBoundsSize(layoutWidth:number, layoutHeight:number):void {
            UIImpl.prototype.setLayoutBoundsSize.call(this, layoutWidth, layoutHeight);
            if (isNaN(layoutWidth) || layoutWidth === this._widthConstraint || layoutWidth == 0) {
                this._widthConstraint = layoutWidth;
                return;
            }
            this._widthConstraint = layoutWidth;
            let values = this.$UIComponent;
            if (!isNaN(values[UIKeys.explicitHeight])) {
                return;
            }
            if (layoutWidth == values[UIKeys.measuredWidth]) {
                return;
            }
            this.invalidateSize();
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public setLayoutBoundsPosition(x:number, y:number):void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public getLayoutBounds(bounds:Rectangle):void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public getPreferredBounds(bounds:Rectangle):void {
        }
    }

    implementUIComponent(Label, TextField);
    registerBindable(Label.prototype, "text");