// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { Texture, $TextureScaleFactor } from "./Texture";
import { BitmapData } from "./BitmapData";
import { DisplayObject } from "./DisplayObject";
import { Rectangle } from "../geom/Rectangle";
import { Matrix } from "../geom/Matrix";
import { nativeRender } from "../player/Player";
import { RenderBuffer } from "../player/RenderBuffer";
import { systemRenderer } from "../player/SystemRenderer";


    /**
     * RenderTexture is a dynamic texture
     * @extends Texture
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/display/RenderTexture.ts
     * @language en_US
     */
    /**
     * RenderTexture 是动态纹理类，他实现了将显示对象及其子对象绘制成为一个纹理的功能
     * @extends Texture
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/display/RenderTexture.ts
     * @language zh_CN
     */
    export class RenderTexture extends Texture {

        constructor() {
            super();
            this.$renderBuffer = new sys.RenderBuffer();
            let bitmapData = new BitmapData(this.$renderBuffer.surface);
            bitmapData.$deleteSource = false;
            this._setBitmapData(bitmapData);
        }

        public $renderBuffer: RenderBuffer;
        /**
         * The specified display object is drawn as a texture
         * @param displayObject {DisplayObject} the display to draw
         * @param clipBounds {Rectangle} clip rect
         * @param scale {number} scale factor
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 将指定显示对象绘制为一个纹理
         * @param displayObject {DisplayObject} 需要绘制的显示对象
         * @param clipBounds {Rectangle} 绘制矩形区域
         * @param scale {number} 缩放比例
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public drawToTexture(displayObject: DisplayObject, clipBounds?: Rectangle, scale: number = 1): boolean {
            if (clipBounds && (clipBounds.width == 0 || clipBounds.height == 0)) {
                return false;
            }

            let bounds = clipBounds || displayObject.$getOriginalBounds();
            if (bounds.width == 0 || bounds.height == 0) {
                return false;
            }

            scale /= $TextureScaleFactor;
            let width = (bounds.x + bounds.width) * scale;
            let height = (bounds.y + bounds.height) * scale;
            if (clipBounds) {
                width = bounds.width * scale;
                height = bounds.height * scale;
            }

            let renderBuffer = this.$renderBuffer;
            if (!renderBuffer) {
                return false;
            }
            renderBuffer.resize(width, height);
            this.$bitmapData.width = width;
            this.$bitmapData.height = height;

            if (nativeRender) {
                egret_native.activateBuffer(this.$renderBuffer);
                let useClip = false;
                let clipX = 0;
                let clipY = 0;
                let clipW = 0;
                let clipH = 0;
                if (clipBounds) {
                    useClip = true;
                    clipX = clipBounds.x;
                    clipY = clipBounds.y;
                    clipW = clipBounds.width;
                    clipH = clipBounds.height;
                }
                egret_native.updateNativeRender();
                egret_native.nrRenderDisplayObject(displayObject.$nativeDisplayObject.id, scale, useClip, clipX, clipY, clipW, clipH);
                egret_native.activateBuffer(null);
            }
            else {
                let matrix = Matrix.create();
                matrix.identity();
                matrix.scale(scale, scale);
                //应用裁切
                if (clipBounds) {
                    matrix.translate(-clipBounds.x, -clipBounds.y);
                }
                systemRenderer.render(displayObject, renderBuffer, matrix, true);
                Matrix.release(matrix);
            }

            //设置纹理参数
            this.$initData(0, 0, width, height, 0, 0, width, height, width, height);

            return true;
        }

        /**
         * @inheritDoc
         */
        public getPixel32(x: number, y: number): number[] {
            let data: number[];
            if (this.$renderBuffer) {
                let scale = $TextureScaleFactor;
                x = Math.round(x / scale);
                y = Math.round(y / scale);
                data = this.$renderBuffer.getPixels(x, y, 1, 1);
            }
            return data;
        }

        /**
         * @inheritDoc
         */
        public dispose(): void {
            super.dispose();
            this.$renderBuffer = null;
        }
    }