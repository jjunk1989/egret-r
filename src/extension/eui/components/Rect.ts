// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


import { egret } from '@egret-r/core';
const { Graphics, Rectangle } = egret;
import { Component } from "./Component";

    /**
     * The Rect component is a rectangular shape. It can be touched.
     * @version Egret 2.5.5
     * @version eui 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * Rect 组件矩形绘图元素。此组件可响应鼠标事件。
     * @version Egret 2.5.5
     * @version eui 1.0
     * @platform Web
     * @language zh_CN
     */
    export class Rect extends Component {
        constructor(width?: number, height?: number, fillColor?: number) {
            super();
            this.touchChildren = false;
            this.$graphics = new Graphics();
            this.$graphics.$setTarget(this);
            this.width = width;
            this.height = height;
            this.fillColor = fillColor;
        }

        protected createNativeDisplayObject(): void {
            this.$nativeDisplayObject = new egret_native.NativeDisplayObject(egret_native.NativeObjectType.GRAPHICS);
        }

        /**
         * @private
         */
        $graphics: Graphics;

        public get graphics(): Graphics {
            return this.$graphics;
        }

        /**
         * @private
         */
        $measureContentBounds(bounds: Rectangle): void {
            if (this.$graphics) {
                bounds.setTo(0, 0, this.width, this.height);
            }
        }

        private $fillColor: number = 0x000000;
        /**
         * Fill color
         * @version Egret 2.5.5
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 填充颜色
         * @version Egret 2.5.5
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public get fillColor(): number {
            return this.$fillColor;
        }

        public set fillColor(value: number) {
            if (value == undefined || this.$fillColor == value)
                return;
            this.$fillColor = value;
            this.invalidateDisplayList();
        }

        private $fillAlpha: number = 1;
        /**
         * Fill alpha
         * @version Egret 2.5.5
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 填充透明度,默认值为1。
         * @version Egret 2.5.5
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public get fillAlpha(): number {
            return this.$fillAlpha;
        }

        public set fillAlpha(value: number) {
            if (this.$fillAlpha == value)
                return;
            this.$fillAlpha = value;
            this.invalidateDisplayList();
        }

        private $strokeColor: number = 0x444444;
        /**
         * The line's color inside the rect border. Caution: when the strokeWeight is 0, a line is not drawn
         * @version Egret 2.5.5
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 边框颜色,注意：当 strokeWeight 为 0 时，不显示边框。
         * @version Egret 2.5.5
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public get strokeColor(): number {
            return this.$strokeColor;
        }

        public set strokeColor(value: number) {
            if (this.$strokeColor == value)
                return;
            this.$strokeColor = value;
            this.invalidateDisplayList();
        }

        private $strokeAlpha: number = 1;
        /**
         * The line's alpha inside the rect border. Caution: when the strokeWeight is 0, a line is not drawn
         * @version Egret 2.5.5
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 边框透明度,注意：当 strokeWeight 为0时，不显示边框。
         * @version Egret 2.5.5
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public get strokeAlpha(): number {
            return this.$strokeAlpha;
        }

        public set strokeAlpha(value: number) {
            if (this.$strokeAlpha == value)
                return;
            this.$strokeAlpha = value;
            this.invalidateDisplayList();
        }

        private $strokeWeight: number = 0;
        /**
         * The line's thickness inside the rect border. Caution: when the strokeWeight is 0, a line is not drawn
         * @version Egret 2.5.5
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 边框粗细(像素),注意：当 strokeWeight 为 0 时，不显示边框。
         * @version Egret 2.5.5
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public get strokeWeight(): number {
            return this.$strokeWeight;
        }

        public set strokeWeight(value: number) {
            if (this.$strokeWeight == value)
                return;
            this.$strokeWeight = value;
            this.invalidateDisplayList();
        }

        private $ellipseWidth: number = 0;
        /**
         * Width used to draw an ellipse with rounded corners (in pixels).
         * @version Egret 2.5.5
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 用于绘制圆角的椭圆的宽度(以像素为单位)
         * @version Egret 2.5.5
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public get ellipseWidth(): number {
            return this.$ellipseWidth;
        }

        public set ellipseWidth(value: number) {
            if (this.$ellipseWidth == value)
                return;
            this.$ellipseWidth = value;
            this.invalidateDisplayList();
        }

        private $ellipseHeight: number = 0;
        /**
         * Height used to draw an ellipse with rounded corners (in pixels). If no value is specified, the default value matches the value of the ellipseWidth parameter.
         * @version Egret 2.5.5
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 用于绘制圆角的椭圆的高度 (以像素为单位)。如果未指定值，则默认值与为 ellipseWidth 参数提供的值相匹配。
         * @version Egret 2.5.5
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public get ellipseHeight(): number {
            return this.$ellipseHeight;
        }

        public set ellipseHeight(value: number) {
            if (this.$ellipseHeight == value)
                return;
            this.$ellipseHeight = value;
            this.invalidateDisplayList();
        }

        /**
         * @copy UIComponent#updateDisplayList
         *
         * @version Egret 2.5.5
         * @version eui 1.0
         * @platform Web
         */
        protected updateDisplayList(unscaledWidth: number, unscaledHeight: number): void {
            let g = this.graphics;
            g.clear();
            if (this.$strokeWeight > 0) {
                g.beginFill(this.$fillColor, 0);
                g.lineStyle(this.$strokeWeight, this.$strokeColor, this.$strokeAlpha, true, "normal", "square", "miter");
                if (this.$ellipseWidth == 0 && this.$ellipseHeight == 0) {
                    g.drawRect(this.$strokeWeight / 2, this.$strokeWeight / 2, unscaledWidth - this.$strokeWeight, unscaledHeight - this.$strokeWeight);
                } else {
                    g.drawRoundRect(this.$strokeWeight / 2, this.$strokeWeight / 2, unscaledWidth - this.$strokeWeight, unscaledHeight - this.$strokeWeight, this.$ellipseWidth, this.$ellipseHeight);
                }
                g.endFill();
            }
            g.beginFill(this.$fillColor, this.$fillAlpha);
            g.lineStyle(this.$strokeWeight, this.$strokeColor, 0, true, "normal", "square", "miter");
            if (this.$ellipseWidth == 0 && this.$ellipseHeight == 0) {
                g.drawRect(this.$strokeWeight, this.$strokeWeight, unscaledWidth - this.$strokeWeight * 2, unscaledHeight - this.$strokeWeight * 2);
            } else {
                g.drawRoundRect(this.$strokeWeight, this.$strokeWeight, unscaledWidth - this.$strokeWeight * 2, unscaledHeight - this.$strokeWeight * 2, this.$ellipseWidth, this.$ellipseHeight);
            }
            g.endFill();
        }

        /**
         * @private
         */
        public $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
            if (this.$graphics) {
                this.$graphics.$onRemoveFromStage();
            }
        }
    }
