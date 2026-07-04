// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { Texture } from "../display/Texture";
import { Rectangle, $TempRectangle } from "../geom/Rectangle";
import { RenderTexture } from "../display/RenderTexture";
import { Bitmap } from "../display/Bitmap";
import { createCanvas, systemRenderer } from "../player/SystemRenderer";
import { CanvasRenderingContext2D } from "../player/rendering/CanvasRenderer";
import { $error } from "../../Defines.debug";
import { $warn } from "../../Defines.debug";
import { Capabilities } from "../system/Capabilities";


    let sharedCanvas: HTMLCanvasElement;
    let sharedContext: CanvasRenderingContext2D;

    /**
     * @private
     */
    function convertImageToCanvas(texture: Texture, rect?: Rectangle): HTMLCanvasElement {
        if (!sharedCanvas) {
            sharedCanvas = createCanvas()
            sharedContext = sharedCanvas.getContext("2d");
        }

        let w = texture.$getTextureWidth();
        let h = texture.$getTextureHeight();
        if (rect == null) {
            rect = $TempRectangle;
            rect.x = 0;
            rect.y = 0;
            rect.width = w;
            rect.height = h;
        }

        rect.x = Math.min(rect.x, w - 1);
        rect.y = Math.min(rect.y, h - 1);
        rect.width = Math.min(rect.width, w - rect.x);
        rect.height = Math.min(rect.height, h - rect.y);

        let iWidth = rect.width;
        let iHeight = rect.height;
        let surface = sharedCanvas;
        surface["style"]["width"] = iWidth + "px";
        surface["style"]["height"] = iHeight + "px";
        sharedCanvas.width = iWidth;
        sharedCanvas.height = iHeight;

        if (Capabilities.renderMode == "webgl") {
            let renderTexture: RenderTexture;
            //webgl下非RenderTexture纹理先画到RenderTexture
            if (!(<RenderTexture>texture).$renderBuffer) {
                if (systemRenderer.renderClear) {
                    systemRenderer.renderClear();
                }
                renderTexture = new RenderTexture();
                renderTexture.drawToTexture(new Bitmap(texture));
            }
            else {
                renderTexture = <RenderTexture>texture;
            }
            //从RenderTexture中读取像素数据，填入canvas
            let pixels = renderTexture.$renderBuffer.getPixels(rect.x, rect.y, iWidth, iHeight);
            let imageData = new ImageData(iWidth, iHeight);
            for (let i = 0; i < pixels.length; i++) {
                imageData.data[i] = pixels[i];
            }
            sharedContext.putImageData(imageData, 0, 0);

            if (!(<RenderTexture>texture).$renderBuffer) {
                renderTexture.dispose();
            }

            return surface;
        }
        else {
            let bitmapData = texture;
            let offsetX: number = Math.round(bitmapData.$offsetX);
            let offsetY: number = Math.round(bitmapData.$offsetY);
            let bitmapWidth: number = bitmapData.$bitmapWidth;
            let bitmapHeight: number = bitmapData.$bitmapHeight;
            sharedContext.drawImage(bitmapData.$bitmapData.source, bitmapData.$bitmapX + rect.x / $TextureScaleFactor, bitmapData.$bitmapY + rect.y / $TextureScaleFactor,
                bitmapWidth * rect.width / w, bitmapHeight * rect.height / h, offsetX, offsetY, rect.width, rect.height);
            return surface;
        }
    }

    /**
     * @private
     */
    function toDataURL(type: string, rect?: Rectangle, encoderOptions?): string {
        try {
            let surface = convertImageToCanvas(this, rect);
            let result = surface.toDataURL(type, encoderOptions);
            return result;
        }
        catch (e) {
            $error(1033);
        }
        return null;
    }

    /**
     * 有些杀毒软件认为 saveToFile 可能是一个病毒文件
     */
    function eliFoTevas(type: string, filePath: string, rect?: Rectangle, encoderOptions?): void {
        let base64 = toDataURL.call(this, type, rect, encoderOptions);
        if (base64 == null) {
            return;
        }

        let href = base64.replace(/^data:image[^;]*/, "data:image/octet-stream");
        let aLink = document.createElement('a');
        aLink['download'] = filePath;
        aLink.href = href;

        var evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
        aLink.dispatchEvent(evt);
    }

    function getPixel32(x: number, y: number): number[] {
        $warn(1041, "getPixel32", "getPixels");
        return this.getPixels(x, y);
    }

    function getPixels(x: number, y: number, width: number = 1, height: number = 1): number[] {
        //webgl环境下不需要转换成canvas获取像素信息
        if (Capabilities.renderMode == "webgl") {
            let renderTexture: RenderTexture;
            //webgl下非RenderTexture纹理先画到RenderTexture
            if (!(<RenderTexture>this).$renderBuffer) {
                renderTexture = new RenderTexture();
                renderTexture.drawToTexture(new Bitmap(this));
            }
            else {
                renderTexture = <RenderTexture>this;
            }
            //从RenderTexture中读取像素数据
            let pixels = renderTexture.$renderBuffer.getPixels(x, y, width, height);
            return pixels;
        }
        try {
            let surface = convertImageToCanvas(this);
            let result = sharedContext.getImageData(x, y, width, height).data;
            return <number[]><any>result;
        }
        catch (e) {
            $error(1039);
        }
    }

    Texture.prototype.toDataURL = toDataURL;
    Texture.prototype.saveToFile = eliFoTevas;
    Texture.prototype.getPixel32 = getPixel32;
    Texture.prototype.getPixels = getPixels;
