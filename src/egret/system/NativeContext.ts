// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { Filter } from "../filters/Filter";
import { Texture } from "../display/Texture";
import { TextField } from "../text/TextField";
import { Graphics } from "../display/Graphics";
import { ITextElement } from "../text/ITextElement";
import { Matrix } from "../geom/Matrix";
import { RenderBuffer } from "../player/RenderBuffer";

/**
 * @private
 */
    //todo remove
    /**
     * @private
     */
    export let fontMapping = {};
/**
 * @private
 */
declare namespace egret_native {

export declare function readUpdateFileSync(filePath): any;
export declare function readResourceFileSync(filePath): any;

export declare function sendInfoToPlugin(info: string): void;

export declare function receivedPluginInfo(info: string): void;

export declare function nrInit(): void;
export declare function nrDownloadBuffers(callback: (displayCmdBuffer: Float32Array) => void): void;
export declare function nrSetRenderMode(mode: number): void;
export declare function nrRenderDisplayObject(id: number, scale: number, useClip: boolean, clipX: number, clipY: number, clipW: number, clipH: number): void;
export declare function nrRenderDisplayObject2(id: number, offsetX: number, offsetY: number, forHitTest: boolean): void;
export declare function nrLocalToGlobal(id: number, localX: number, localY: number): string;
export declare function nrGlobalToLocal(id: number, globalX: number, globalY: number): string;
export declare function nrGetTextFieldWidth(id: number): number;
export declare function nrGetTextFieldHeight(id: number): number;
export declare function nrGetTextWidth(id: number): number;
export declare function nrGetTextHeight(id: number): number;
export declare function nrResize(width: number, height: number): void;
export declare function nrSetCanvasScaleFactor(factor: number, scalex: number, scaley: number): void;
export declare function nrUpdate(): void;
export declare function nrRender(): void;
export declare function nrSendTextFieldData(textFieldId: number, strData: string): void;
export declare function nrUpdateCallbackList(dt: number): void;
export declare function nrActiveBuffer(id: number, width: number, height: number): void;
export declare function nrGetPixels(x: number, y: number, width: number, height: number, pixels: Uint8Array): void;
export declare function nrGetCustomImageId(type: number): number;
export declare function nrSetCustomImageData(customImageId: number, pvrtcData, width, height, mipmapsCount, format): void;

    class NrNode {
        constructor(id: number, type: number)
    }
}

/**
 * @private
 */
declare namespace egret_native {
    let rootWebGLBuffer: RenderBuffer;
    let forHitTest: boolean;
    let addModuleCallback: (callback: Function, thisObj: any) => void;
    let initNativeRender: () => void;
    let updateNativeRender: () => void;
    let activateBuffer: (buffer: RenderBuffer) => void;
    let getJsCustomFilterVertexSrc: (key: any) => any;
    let getJsCustomFilterFragSrc: (key: any) => any;
    let getJsCustomFilterUniforms: (key: any) => any;
    let nrABIVersion: number;
    let nrMinEgretVersion: string;
}
declare namespace egret_native {
    /**
     * @private
     */
    class NativeRenderSurface {
        width: number;
        height: number;
        constructor(currRenderBuffer: any, w?: number, h?: number, root?: boolean);
        resize(w: number, h: number): void;
    }
    /**
     * @private
     */
    class NativeBitmapData {
        public $init();
        public $id;
    }
    /**
     * @private
     */
    class NativeDisplayObject {
        id: number;
        constructor(type: number);
        public setChildrenSortMode(mode: string): void;
        public addChildAt(childId: number, index: number): void;
        public removeChild(childId: number): void;
        public swapChild(index1: number, index2: number): void;
        public setX(value: number): void;
        public setY(value: number): void;
        public setRotation(value: number): void;
        public setScaleX(value: number): void;
        public setScaleY(value: number): void;
        public setSkewX(value: number): void;
        public setSkewY(value: number): void;
        public setAlpha(value: number): void;
        public setAnchorOffsetX(value: number): void;
        public setAnchorOffsetY(value: number): void;
        public setVisible(value: boolean): void;
        public setBlendMode(value: number): void;
        public setMaskRect(x: number, y: number, w: number, h: number): void;
        public setScrollRect(x: number, y: number, w: number, h: number): void;
        public setFilters(filters: Array<Filter>): void;
        public static createFilter(filter: Filter): void;
        public static setFilterPadding(filterId: number, paddingTop: number, paddingBottom: number, paddingLeft: number, paddingRight: number): void;
        public setMask(value: number): void;
        public static setSourceToNativeBitmapData(nativeBitmapData: egret_native.NativeBitmapData, source: any);
        public setTexture(texture: Texture): void;
        public setBitmapDataToMesh(texture: Texture): void;
        public setBitmapDataToParticle(texture: Texture): void;
        public setWidth(value: number): void;
        public setHeight(value: number): void;
        public setCacheAsBitmap(value: boolean): void;
        public setBitmapFillMode(fillMode: string): void;
        public setScale9Grid(x: number, y: number, w: number, h: number): void;
        public setMatrix(a: number, b: number, c: number, d: number, tx: number, ty: number): void;
        public setIsTyping(value: boolean): void;
        public setDataToBitmapNode(id: number, texture: Texture, arr: number[]): void;
        public setDataToMesh(vertexArr: number[], indiceArr: number[], uvArr: number[]): void;
        public static setDataToFilter(currFilter: Filter): void;
        public static disposeNativeBitmapData(nativeBitmapData: egret_native.NativeBitmapData): void;
        public static disposeTextData(node: TextField): void;
        public static disposeGraphicData(graphic: Graphics): void;
        public setFontSize(value: number): void;
        public setLineSpacing(value: number): void;
        public setTextColor(value: number): void;
        public setTextFieldWidth(value: number): void;
        public setTextFieldHeight(value: number): void;
        public setFontFamily(value: string): void;
        public setTextFlow(textArr: Array<ITextElement>): void;
        public setTextAlign(value: string): void;
        public setVerticalAlign(value: string): void;
        public setText(value: string): void;
        public setBold(value: boolean): void;
        public setItalic(value: boolean): void;
        public setWordWrap(value: boolean): void;
        public setMaxChars(value: number): void;
        public setType(value: string): void;
        public setStrokeColor(value: number): void;
        public setStroke(value: number): void;
        public setScrollV(value: number): void;
        public setMultiline(value: boolean): void;
        public setBorder(value: boolean): void;
        public setBorderColor(value: number): void;
        public setBackground(value: boolean): void;
        public setBackgroundColor(value: number): void;
        public setInputType(value: string): void;
        public setBeginFill(color: number, alpha?: number): void;
        public setBeginGradientFill(type: string, colors: number[], alphas: number[], ratios: number[], matrix: Matrix): void;
        public setEndFill(): void;
        public setLineStyle(thickness?: number, color?: number, alpha?: number, pixelHinting?: boolean, scaleMode?: string, caps?: string, joints?: string, miterLimit?: number, lineDash?: number[]): void;
        public setDrawRect(x: number, y: number, width: number, height: number): void;
        public setDrawRoundRect(x: number, y: number, width: number, height: number, ellipseWidth: number, ellipseHeight?: number): void;
        public setDrawCircle(x: number, y: number, radius: number): void;
        public setDrawEllipse(x: number, y: number, width: number, height: number): void;
        public setMoveTo(x: number, y: number): void;
        public setLineTo(x: number, y: number): void;
        public setCurveTo(controlX: number, controlY: number, anchorX: number, anchorY: number): void;
        public setCubicCurveTo(controlX1: number, controlY1: number, controlX2: number, controlY2: number, anchorX: number, anchorY: number): void;
        public setDrawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
        public setGraphicsClear(): void;
        public setZIndex(value: number): void;
        public sortChildren(): void;
        public setSortableChildren(value: boolean): void;
        public setTint(value: number): void;
        public setSmoothing(value: boolean): void;
    }
}
/**
 * @private
 */
declare namespace egret_native {
    /**
     * @private
     */
    const enum NativeObjectType {
        /**
         * 容器
         */
        CONTAINER = 0,
        /**
         * 位图
         */
        BITMAP = 1,
        /**
         * 位图数据
         */
        BITMAP_DATA = 2,
        /**
         * 滤镜
         */
        FILTER = 6,
        /**
         * 文本
         */
        TEXT = 7,
        /**
         * 矢量绘图
         */
        GRAPHICS = 8,
        /**
         * 含一个适量绘图的容器
         */
        SPRITE = 9,
        /**
         * 粒子系统
         */
        PARTICLE_SYSTEM = 10,
        /**
         * 位图文本
         */
        BITMAP_TEXT = 11,
        /**
         * 网格
         */
        MESH = 12,
        /**
         * 舞台（根容器）
         */
        STAGE = 13,
    }
}