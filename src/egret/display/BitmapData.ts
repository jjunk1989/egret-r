// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { Bitmap } from "./Bitmap";
import { nativeRender } from "../player/Player";
import { Base64Util } from "../utils/Base64Util";
import { WebGLUtils } from "../web/rendering/webgl/WebGLUtils";
import { createMap } from "../utils/DataStructure";
import { HashObject, Nullable } from "../utils/HashObject";
import { DisplayObject } from "./DisplayObject";
import { sys } from "../system/SysData";
import { Capabilities } from "../system/Capabilities";


    //refactor
    export class CompressedTextureData {
        public glInternalFormat: number;
        public width: number;
        public height: number;
        public byteArray: Uint8Array;
        public face: number;
        public level: number;
    }

    export const etc_alpha_mask = 'etc_alpha_mask';
    sys.etc_alpha_mask = etc_alpha_mask;
    export const engine_default_empty_texture = 'engine_default_empty_texture';
    sys.engine_default_empty_texture = engine_default_empty_texture;
    export const is_compressed_texture = 'is_compressed_texture';
    sys.is_compressed_texture = is_compressed_texture;
    export const glContext = 'glContext';
    sys.glContext = glContext;
    export const UNPACK_PREMULTIPLY_ALPHA_WEBGL = 'UNPACK_PREMULTIPLY_ALPHA_WEBGL';
    sys.UNPACK_PREMULTIPLY_ALPHA_WEBGL = UNPACK_PREMULTIPLY_ALPHA_WEBGL;


    /**
     * A BitmapData object contains an array of pixel data. This data can represent either a fully opaque bitmap or a
     * transparent bitmap that contains alpha channel data. Either type of BitmapData object is stored as a buffer of 32-bit
     * integers. Each 32-bit integer determines the properties of a single pixel in the bitmap.<br/>
     * Each 32-bit integer is a combination of four 8-bit channel values (from 0 to 255) that describe the alpha transparency
     * and the red, green, and blue (ARGB) values of the pixel. (For ARGB values, the most significant byte represents the
     * alpha channel value, followed by red, green, and blue.)
     * @see Bitmap
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * BitmapData 对象是一个包含像素数据的数组。此数据可以表示完全不透明的位图，或表示包含 Alpha 通道数据的透明位图。
     * 以上任一类型的 BitmapData 对象都作为 32 位整数的缓冲区进行存储。每个 32 位整数确定位图中单个像素的属性。<br/>
     * 每个 32 位整数都是四个 8 位通道值（从 0 到 255）的组合，这些值描述像素的 Alpha 透明度以及红色、绿色、蓝色 (ARGB) 值。
     * （对于 ARGB 值，最高有效字节代表 Alpha 通道值，其后的有效字节分别代表红色、绿色和蓝色通道值。）
     * @see Bitmap
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
    export class BitmapData extends HashObject {
        /**
         * The width of the bitmap image in pixels.
         * @readOnly
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 位图图像的宽度，以像素为单位。
         * @readOnly
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        width: number;
        /**
         * The height of the bitmap image in pixels.
         * @readOnly
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 位图图像的高度，以像素为单位。
         * @readOnly
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        height: number;

        /**
         * Original bitmap image.
         * HTMLImageElement|HTMLCanvasElement|HTMLVideoElement
         * @version Egret 2.4
         * @platform Web
         * @private
         * @language en_US
         */
        /**
         * 原始位图图像。
         * HTMLImageElement|HTMLCanvasElement|HTMLVideoElement
         * @version Egret 2.4
         * @platform Web
         * @private
         * @language zh_CN
         */
        $source: any;

        /**
         * WebGL texture.
         * @version Egret 2.4
         * @platform Web
         * @private
         * @language en_US
         */
        /**
         * WebGL纹理。
         * @version Egret 2.4
         * @platform Web
         * @private
         * @language zh_CN
         */
        webGLTexture: any;

        /**
         * Texture format.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 纹理格式。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        format: string = "image";

        /**
         * @private
         * webgl纹理生成后，是否删掉原始图像数据
         */
        $deleteSource: boolean = true;

        /**
         * @private
         * id
         */
        public $nativeBitmapData: egret_native.NativeBitmapData;

        /**
         * @private
         * 
         */
        public readonly compressedTextureData: Array<Array<CompressedTextureData>> = [];
        public debugCompressedTextureURL: string = '';
        public $etcAlphaMask: Nullable<BitmapData> = null;

        /**
         * Initializes a BitmapData object to refer to the specified source object.
         * @param source The source object being referenced.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 创建一个引用指定 source 实例的 BitmapData 对象
         * @param source 被引用的 source 实例
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        constructor(source: any) {
            super();
            if (nativeRender) {
                let nativeBitmapData = new egret_native.NativeBitmapData();
                nativeBitmapData.$init();
                this.$nativeBitmapData = nativeBitmapData;
            }
            this.source = source;
            if (this.source) {
                this.width = +source.width;
                this.height = +source.height;
            }
            else {
                ///compressed texture?
            }
        }

        public get source(): any {
            return this.$source;
        }

        public set source(value: any) {
            this.$source = value;
            if (nativeRender) {
                egret_native.NativeDisplayObject.setSourceToNativeBitmapData(this.$nativeBitmapData, value);
            }
        }

        public static create(type: "arraybuffer", data: ArrayBuffer, callback?: (bitmapData: BitmapData) => void): BitmapData;
        public static create(type: "base64", data: string, callback?: (bitmapData: BitmapData) => void): BitmapData;
        public static create(type: "arraybuffer" | "base64", data: ArrayBuffer | string, callback?: (bitmapData: BitmapData) => void): BitmapData {
            let base64 = "";
            if (type === "arraybuffer") {
                base64 = Base64Util.encode(data as ArrayBuffer);
            }
            else {
                base64 = data as string;
            }
            let imageType = "image/png";//default value
            if (base64.charAt(0) === '/') {
                imageType = "image/jpeg";
            } else if (base64.charAt(0) === 'R') {
                imageType = "image/gif";
            } else if (base64.charAt(0) === 'i') {
                imageType = "image/png";
            }
            let img: HTMLImageElement = new Image();
            img.src = "data:" + imageType + ";base64," + base64;
            img.crossOrigin = '*';
            let bitmapData = new BitmapData(img);
            img.onload = function () {
                img.onload = undefined;
                bitmapData.source = img;
                bitmapData.height = img.height;
                bitmapData.width = img.width;
                if (callback) {
                    callback(bitmapData);
                }
            }
            return bitmapData;
        }

        public $dispose(): void {
            if (Capabilities.renderMode == "webgl" && this.webGLTexture) {
                WebGLUtils.deleteWebGLTexture(this.webGLTexture);
                this.webGLTexture = null;
            }
            //native or WebGLRenderTarget
            if (this.source && this.source.dispose) {
                this.source.dispose();
            }
            // WeChat Memory leakage bug
            if (this.source && this.source.src) {
                this.source.src = "";
            }
            this.source = null;

            ///dispose compressed texture info
            //this.bitmapCompressedData.length = 0;
            this.clearCompressedTextureData();
            this.debugCompressedTextureURL = '';
            this.etcAlphaMask = null;
            ///

            if (nativeRender) {
                egret_native.NativeDisplayObject.disposeNativeBitmapData(this.$nativeBitmapData);
            }
            BitmapData.$dispose(this);
        }


        private static _displayList = createMap<DisplayObject[]>();
        static $addDisplayObject(displayObject: DisplayObject, bitmapData: BitmapData): void {
            if (!bitmapData) {
                return;
            }
            let hashCode: number = bitmapData.hashCode;
            if (!hashCode) {
                return;
            }
            if (!BitmapData._displayList[hashCode]) {
                BitmapData._displayList[hashCode] = [displayObject];
                return;
            }
            let tempList: Array<DisplayObject> = BitmapData._displayList[hashCode];
            if (tempList.indexOf(displayObject) < 0) {
                tempList.push(displayObject);
            }
        }

        static $removeDisplayObject(displayObject: DisplayObject, bitmapData: BitmapData): void {
            if (!bitmapData) {
                return;
            }
            let hashCode: number = bitmapData.hashCode;
            if (!hashCode) {
                return;
            }
            if (!BitmapData._displayList[hashCode]) {
                return;
            }
            let tempList: Array<DisplayObject> = BitmapData._displayList[hashCode];
            let index: number = tempList.indexOf(displayObject);
            if (index >= 0) {
                tempList.splice(index, 1);
            }
        }

        static $invalidate(bitmapData: BitmapData): void {
            if (!bitmapData) {
                return;
            }
            let hashCode: number = bitmapData.hashCode;
            if (!hashCode) {
                return;
            }
            if (!BitmapData._displayList[hashCode]) {
                return;
            }
            let tempList: Array<DisplayObject> = BitmapData._displayList[hashCode];
            for (let i: number = 0; i < tempList.length; i++) {
                if (tempList[i] instanceof Bitmap) {
                    (<Bitmap>tempList[i]).$refreshImageData();
                }
                let bitmap = tempList[i];
                bitmap.$renderDirty = true;
                let p = bitmap.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = bitmap.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }

        static $dispose(bitmapData: BitmapData): void {
            if (!bitmapData) {
                return;
            }
            let hashCode: number = bitmapData.hashCode;
            if (!hashCode) {
                return;
            }
            if (!BitmapData._displayList[hashCode]) {
                return;
            }
            let tempList = BitmapData._displayList[hashCode];
            for (let node of tempList) {
                if (node instanceof Bitmap) {
                    node.$bitmapData = null;
                }
                node.$renderDirty = true;
                let p = node.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = node.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
            delete BitmapData._displayList[hashCode];
        }

        private _getCompressedTextureData(level: number, face: number): CompressedTextureData {
            const levelData = this.compressedTextureData[level];
            return levelData ? levelData[face] : null;
        }

        public getCompressed2dTextureData(): CompressedTextureData {
            return this._getCompressedTextureData(0, 0);
        }


        public $setCompressed2dTextureData(levelData: CompressedTextureData[]): void {
            if (nativeRender && (this.compressedTextureData.length == 0)) {
                egret_native.NativeDisplayObject.setSourceToNativeBitmapData(this.$nativeBitmapData, levelData[0]);
            }
            this.compressedTextureData.push(levelData);
        }

        public hasCompressed2d(): boolean {
            return !!this.getCompressed2dTextureData();
        }

        public clearCompressedTextureData(): void {
            this.compressedTextureData.length = 0;
        }

        public set etcAlphaMask(value: any) {
            if (nativeRender) {
                egret_native.NativeDisplayObject.setSourceToNativeBitmapData(this.$nativeBitmapData, value);
            }
            this.$etcAlphaMask = value;
        }

        public get etcAlphaMask(): any {
            return this.$etcAlphaMask;
        }
    }
