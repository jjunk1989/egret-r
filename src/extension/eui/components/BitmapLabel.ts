// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

/// <reference path="../core/UIComponent.ts" />
namespace eui {
    let UIImpl = sys.UIComponentImpl;
    /**
     * BitmapLabel is one line or multiline uneditable BitmapText
     * @version Egret 2.5.3
     * @version eui 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * BitmapLabel 组件是一行或多行不可编辑的位图文本
     * @version Egret 2.5.3
     * @version eui 1.0
     * @platform Web
     * @language zh_CN
     */
    export class BitmapLabel extends egret.BitmapText implements UIComponent, IDisplayText {
        public constructor(text?: string) {
            super();
            this.initializeUIValues();
            this.text = text;
        }
        /**
         * @private
         */
        $invalidateContentBounds(): void {
            super.$invalidateContentBounds();
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
        $setText(value: string): boolean {
            let result: boolean = super.$setText(value);
            PropertyEvent.dispatchPropertyEvent(this, PropertyEvent.PROPERTY_CHANGE, "text");
            return result;
        }
        private $fontForBitmapLabel: string | egret.BitmapFont;
        $setFont(value: any): boolean {
            if (this.$fontForBitmapLabel == value) {
                return false;
            }
            this.$fontForBitmapLabel = value;
            if (this.$createChildrenCalled) {
                this.$parseFont();
            } else {
                this.$fontChanged = true;
            }
            this.$fontStringChanged = true;
            return true;
        }
        private $createChildrenCalled: boolean = false;
        private $fontChanged: boolean = false;
        /**
         * 解析source
         */
        private $parseFont(): void {
            this.$fontChanged = false;
            let font = this.$fontForBitmapLabel;
            if (typeof font == "string") {
                getAssets(font, function (bitmapFont) {
                    this.$setFontData(bitmapFont, <string>font);
                }, this);
            } else {
                this.$setFontData(font);
            }
        }

        $setFontData(value: egret.BitmapFont, font?: string): boolean {
            if (font && font != this.$fontForBitmapLabel) {
                return;
            }
            if (value == this.$font) {
                return false;
            }
            this.$font = value;
            this.$invalidateContentBounds();
            return true;
        }
        /**
         * @private
         */
        private _widthConstraint: number = NaN;
        /**
         * @private
         */
        private _heightConstraint: number = NaN;
        //=======================UIComponent接口实现===========================
        /**
         * @private
         * UIComponentImpl 定义的所有变量请不要添加任何初始值，必须统一在此处初始化。
         */
        private initializeUIValues: () => void;
        /**
         * @copy eui.UIComponent#createChildren
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected createChildren(): void {
            if (this.$fontChanged) {
                this.$parseFont();
            }
            this.$createChildrenCalled = true;
        }

        /**
         * @copy eui.UIComponent#childrenCreated
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected childrenCreated(): void {

        }

        /**
         * @copy eui.UIComponent#commitProperties
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected commitProperties(): void {

        }

        /**
         * @copy eui.UIComponent#measure
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected measure(): void {
            let values = this.$UIComponent;
            let oldWidth = this.$textFieldWidth;
            let oldHeight = this.$textFieldHeight;
            let availableWidth = NaN;
            if (!isNaN(this._widthConstraint)) {
                availableWidth = this._widthConstraint;
                this._widthConstraint = NaN;
            }
            else if (!isNaN(values[sys.UIKeys.explicitWidth])) {
                availableWidth = values[sys.UIKeys.explicitWidth];
            }
            else if (values[sys.UIKeys.maxWidth] != 100000) {
                availableWidth = values[sys.UIKeys.maxWidth];
            }
            super.$setWidth(availableWidth);
            let availableHeight = NaN;
            if (!isNaN(this._heightConstraint)) {
                availableHeight = this._heightConstraint;
                this._heightConstraint = NaN;
            }
            else if (!isNaN(values[sys.UIKeys.explicitHeight])) {
                availableHeight = values[sys.UIKeys.explicitHeight];
            }
            else if (values[sys.UIKeys.maxHeight] != 100000) {
                availableHeight = values[sys.UIKeys.maxHeight];
            }
            super.$setHeight(availableHeight);
            this.setMeasuredSize(this.textWidth, this.textHeight);
            super.$setWidth(oldWidth);
            super.$setHeight(oldHeight);
        }
        /**
         * @copy eui.UIComponent#updateDisplayList
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
         * @copy eui.UIComponent#invalidateParentLayout
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
         * @copy eui.UIComponent#includeInLayout
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public includeInLayout: boolean;
        /**
         * @copy eui.UIComponent#left
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public left: any;

        /**
         * @copy eui.UIComponent#right
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public right: any;

        /**
         * @copy eui.UIComponent#top
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public top: any;

        /**
         * @copy eui.UIComponent#bottom
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public bottom: any;

        /**
         * @copy eui.UIComponent#horizontalCenter
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public horizontalCenter: any;

        /**
         * @copy eui.UIComponent#verticalCenter
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public verticalCenter: any;

        /**
         * @copy eui.UIComponent#percentWidth
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public percentWidth: number;

        /**
         * @copy eui.UIComponent#percentHeight
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public percentHeight: number;

        /**
         * @copy eui.UIComponent#explicitWidth
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public explicitWidth: number;

        /**
         * @copy eui.UIComponent#explicitHeight
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public explicitHeight: number;


        /**
         * @copy eui.UIComponent#minWidth
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public minWidth: number;
        /**
         * @copy eui.UIComponent#maxWidth
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public maxWidth: number;

        /**
         * @copy eui.UIComponent#minHeight
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public minHeight: number;
        /**
         * @copy eui.UIComponent#maxHeight
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
            if (!isNaN(values[sys.UIKeys.explicitHeight])) {
                return;
            }
            if (layoutWidth == values[sys.UIKeys.measuredWidth]) {
                return;
            }
            this._widthConstraint = layoutWidth;
            this._heightConstraint = layoutHeight;
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
        public getLayoutBounds(bounds: egret.Rectangle): void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public getPreferredBounds(bounds: egret.Rectangle): void {
        }
    }

    sys.implementUIComponent(BitmapLabel, egret.BitmapText);
    registerBindable(BitmapLabel.prototype, "text");
}
