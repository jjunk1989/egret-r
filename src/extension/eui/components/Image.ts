// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


import { egret } from '@egret-r/core';
const { Event, Bitmap, Texture, Rectangle, BitmapFillMode, NormalBitmapNode, BitmapNode, is } = egret;
import { registerProperty } from "../utils/registerProperty";

import { UIComponent, UIKeys, UIComponentImpl, implementUIComponent } from "../core/UIComponent";

import { $warn } from "../../../Defines.debug";

import { getAssets } from "../core/UIComponent";

    /**
     * The Image control lets you show JPEG, PNG, and GIF files
     * at runtime. Image inherit Bitmap，so you can set the <code>bitmapData</code> property
     * to show the data. you can also set the <code>source</code> property, Image will auto load
     * and show the url image or the bitmapData.
     *
     * @event egret.Event.COMPLETE Dispatched when the image loaded complete.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @includeExample  extension/eui/components/ImageExample.ts
     * @language en_US
     */
    /**
     * Image 控件允许您在运行时显示 JPEG、PNG 等图片文件文件。Image 继承至 Bitmap，因此您可以直接对其 bitmapData 属性，
     * 赋值从外部加载得到的位图数据以显示对应图片。同时，Image 还提供了更加方便的 source 属性，source 属性可以接受一个网络图片url作为值，
     * 赋值为url后，它内部会自动去加载并显示图片。并且您同样也可以直接把 BitmapData 对象赋值给 source 属性以显示图片。
     *
     * @event egret.Event.COMPLETE 当图片加载完成后调度
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @includeExample  extension/eui/components/ImageExample.ts
     * @language zh_CN
     */
    export class Image extends Bitmap implements UIComponent {

        /**
         * Constructor.
         *
         * @param source The source used for the bitmap fill. the value can be
         * a string or an instance of <code>Texture</code>
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 构造函数。
         *
         * @param source 用于位图填充的源。可以是一个字符串或者 <code>Texture</code> 对象
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public constructor(source?: string | Texture) {
            super();
            this.initializeUIValues();
            if (source) {
                this.source = source;
            }
        }

        /**
         * Represent a Rectangle Area that the 9 scale area of Image.
         * Notice: This property is valid only when <code>fillMode</code>
         * is <code>BitmapFillMode.SCALE</code>.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 矩形区域，它定义素材对象的九个缩放区域。
         * 注意:此属性仅在<code>fillMode</code>为<code>BitmapFillMode.SCALE</code>时有效。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public get scale9Grid(): Rectangle {
            return this.$scale9Grid;
        }

        public set scale9Grid(value: Rectangle) {
            this.$setScale9Grid(value);
            this.invalidateDisplayList();
        }

        /**
         * Determines how the bitmap fills in the dimensions.
         * <p>When set to <code>BitmapFillMode.CLIP</code>, the bitmap
         * ends at the edge of the region.</p>
         * <p>When set to <code>BitmapFillMode.REPEAT</code>, the bitmap
         * repeats to fill the region.</p>
         * <p>When set to <code>BitmapFillMode.SCALE</code>, the bitmap
         * stretches to fill the region.</p>
         *
         * @default <code>BitmapFillMode.SCALE</code>
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 确定位图填充尺寸的方式。
         * <p>设置为 <code>BitmapFillMode.CLIP</code>时，位图将在边缘处被截断。</p>
         * <p>设置为 <code>BitmapFillMode.REPEAT</code>时，位图将重复以填充区域。</p>
         * <p>设置为 <code>BitmapFillMode.SCALE</code>时，位图将拉伸以填充区域。</p>
         *
         * @default <code>BitmapFillMode.SCALE</code>
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public get fillMode(): string {
            return this.$fillMode;
        }

        public set fillMode(value: string) {
            if (value == this.$fillMode) {
                return;
            }
            super.$setFillMode(value);
            this.invalidateDisplayList();
        }

        //if egret
        $setFillMode(value: string): boolean {
            let result: boolean = super.$setFillMode(value);
            this.invalidateDisplayList();

            return result;
        }

        //endif*/

        /**
         * @private
         */
        private sourceChanged: boolean = false;
        /**
         * @private
         */
        private _source: string | Texture = null;
        /**
         * The source used for the bitmap fill. the value can be
         * a string or an instance of <code>Texture</code>
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 用于位图填充的源。可以是一个字符串或者 <code>Texture</code> 对象
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public get source(): string | Texture {
            return this._source;
        }

        public set source(value: string | Texture) {
            if (value == this._source) {
                return;
            }
            this._source = value;
            if (this.$stage) {
                this.parseSource();
            }
            else {
                this.sourceChanged = true;
                this.invalidateProperties();
            }
        }

        $setTexture(value: Texture): boolean {
            if (value == this.$texture) {
                return false;
            }
            let result: boolean = super.$setTexture(value);
            this.sourceChanged = false;
            this.invalidateSize();
            this.invalidateDisplayList();

            return result;
        }

        /**
         * @private
         * 解析source
         */
        private parseSource(): void {
            this.sourceChanged = false;
            let source = this._source;
            if (source && typeof source == "string") {

                getAssets(<string>this._source, function (data) {
                    if (source !== this._source)
                        return;
                    if (!is(data, "Texture")) {
                        return;
                    }
                    this.$setTexture(data);
                    if (data) {
                        this.dispatchEventWith(Event.COMPLETE);
                    }
                    else if (DEBUG) {
                        $warn(2301, source);
                    }
                }, this);
            }
            else {
                this.$setTexture(<Texture>source);
            }
        }

        $measureContentBounds(bounds: Rectangle): void {
            let image = this.$texture;
            if (image) {
                let uiValues = this.$UIComponent;
                let width = uiValues[UIKeys.width];
                let height = uiValues[UIKeys.height];
                if (isNaN(width) || isNaN(height)) {
                    bounds.setEmpty();
                    return;
                }
                if (this.$fillMode == "clip") {
                    if (width > image.$getTextureWidth()) {
                        width = image.$getTextureWidth();
                    }
                    if (height > image.$getTextureHeight()) {
                        height = image.$getTextureHeight();
                    }
                }
                bounds.setTo(0, 0, width, height);
            }
            else {
                bounds.setEmpty();
            }
        }

        /**
         * @private
         *
         * @param context
         */
        //=======================UIComponent接口实现===========================
        /**
         * @private
         * UIComponentImpl 定义的所有变量请不要添加任何初始值，必须统一在此处初始化。
         */
        private initializeUIValues: () => void;

        /**
         * @copy UIComponent#createChildren
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected createChildren(): void {
            if (this.sourceChanged) {
                this.parseSource();
            }
        }
        /**
         * @private
         * 设置组件的宽高。此方法不同于直接设置width,height属性，
         * 不会影响显式标记尺寸属性
         */
        protected setActualSize(w: number, h: number): void {
            UIComponentImpl.prototype["setActualSize"].call(this, w, h);
            super.$setWidth(w);
            super.$setHeight(h);
        }

        /**
         * @copy UIComponent#childrenCreated
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected childrenCreated(): void {

        }

        /**
         * @copy UIComponent#commitProperties
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected commitProperties(): void {
            UIComponentImpl.prototype["commitProperties"].call(this);
            if (this.sourceChanged) {
                this.parseSource();
            }
        }

        /**
         * @copy UIComponent#measure
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected measure(): void {
            let texture = this.$texture;
            if (texture) {
                this.setMeasuredSize(texture.$getTextureWidth(), texture.$getTextureHeight());
            }
            else {
                this.setMeasuredSize(0, 0);
            }
        }

        /**
         * @copy UIComponent#updateDisplayList
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected updateDisplayList(unscaledWidth: number, unscaledHeight: number): void {
            this.$renderDirty = true;
        }

        /**
         * @copy UIComponent#invalidateParentLayout
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
         * @copy UIComponent#includeInLayout
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public includeInLayout: boolean;
        /**
         * @copy UIComponent#left
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public left: any;

        /**
         * @copy UIComponent#right
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public right: any;

        /**
         * @copy UIComponent#top
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public top: any;

        /**
         * @copy UIComponent#bottom
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public bottom: any;

        /**
         * @copy UIComponent#horizontalCenter
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public horizontalCenter: any;

        /**
         * @copy UIComponent#verticalCenter
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public verticalCenter: any;

        /**
         * @copy UIComponent#percentWidth
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public percentWidth: number;

        /**
         * @copy UIComponent#percentHeight
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public percentHeight: number;

        /**
         * @copy UIComponent#explicitWidth
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public explicitWidth: number;

        /**
         * @copy UIComponent#explicitHeight
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public explicitHeight: number;

        /**
         * @copy UIComponent#minWidth
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public minWidth: number;
        /**
         * @copy UIComponent#maxWidth
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public maxWidth: number;

        /**
         * @copy UIComponent#minHeight
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public minHeight: number;
        /**
         * @copy UIComponent#maxHeight
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

    implementUIComponent(Image, Bitmap);
    registerProperty(Image, "scale9Grid", "Rectangle");