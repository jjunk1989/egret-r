// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { setGeolocation } from "../sensor/Geolocation";
import { setMotion } from "../sensor/Motion";
import { WebGeolocation } from "../sensor/web/WebGeolocation";
import { WebMotion } from "../sensor/web/WebMotion";
import { Capabilities, RuntimeType } from "../system/Capabilities";
import { WebGLRenderContext } from "../player/Player";
import { CanvasRenderingContext2D } from "../player/rendering/CanvasRenderer";
import { BitmapData, glContext, UNPACK_PREMULTIPLY_ALPHA_WEBGL } from "../display/BitmapData";
import { fontResourceCache } from "../text/Font";
import { RenderContext } from "../player/SystemRenderer";
import { $error } from "../../Defines.debug";
import { isIOS14Device, setIsIOS14Device } from "./rendering/webgl/WebGLVertexArrayObject";

    /**
     * @private  
     */
    export enum WEBGL_ATTRIBUTE_TYPE {
        FLOAT_VEC2 = 0x8B50,
        FLOAT_VEC3 = 0x8B51,
        FLOAT_VEC4 = 0x8B52,
        FLOAT = 0x1406,
        BYTE = 0x1400,
        UNSIGNED_BYTE = 0x1401,
        UNSIGNED_SHORT = 0x1403
    }
    /**
     * @private  
     */
    export enum WEBGL_UNIFORM_TYPE {
        FLOAT_VEC2 = 0x8B50,
        FLOAT_VEC3 = 0x8B51,
        FLOAT_VEC4 = 0x8B52,
        INT_VEC2 = 0x8B53,
        INT_VEC3 = 0x8B54,
        INT_VEC4 = 0x8B55,
        BOOL = 0x8B56,
        BOOL_VEC2 = 0x8B57,
        BOOL_VEC3 = 0x8B58,
        BOOL_VEC4 = 0x8B59,
        FLOAT_MAT2 = 0x8B5A,
        FLOAT_MAT3 = 0x8B5B,
        FLOAT_MAT4 = 0x8B5C,
        SAMPLER_2D = 0x8B5E,
        SAMPLER_CUBE = 0x8B60,
        BYTE = 0x1400,
        UNSIGNED_BYTE = 0x1401,
        SHORT = 0x1402,
        UNSIGNED_SHORT = 0x1403,
        INT = 0x1404,
        UNSIGNED_INT = 0x1405,
        FLOAT = 0x1406
    }
    /**
     * 创建一个canvas。
     */
    function mainCanvas(width?: number, height?: number): HTMLCanvasElement {
        let canvas = createCanvas(width, height);
        if (egret.pro && egret.pro.egret2dDriveMode) {
            egret.pro.mainCanvas = canvas;
        }
        return canvas;
    }
    sys.mainCanvas = mainCanvas;

    function createCanvas(width?: number, height?: number): HTMLCanvasElement {
        let canvas: HTMLCanvasElement = document.createElement("canvas");
        if (!isNaN(width) && !isNaN(height)) {
            canvas.width = width;
            canvas.height = height;
        }
        return canvas;
    }
    sys.createCanvas = createCanvas;

    /**
     * _resizeContext。
     */
    export function resizeContext(renderContext: RenderContext, width: number, height: number, useMaxSize?: boolean): void {
        if (!renderContext) {
            return;
        }
        const webglrendercontext = <WebGLRenderContext>renderContext;
        const surface = webglrendercontext.surface;
        if (useMaxSize) {
            if (surface.width < width) {
                surface.width = width;
            }
            if (surface.height < height) {
                surface.height = height;
            }
        }
        else {
            if (surface.width !== width) {
                surface.width = width;
            }
            if (surface.height !== height) {
                surface.height = height;
            }
        }
        webglrendercontext.onResize();
    }
    sys.resizeContext = resizeContext;


    /**
     * _getContextWebGL
     */
    function getContextWebGL(surface: HTMLCanvasElement): WebGLRenderingContext {
        const options = {
            antialias: WebGLRenderContext.antialias,
            stencil: true//设置可以使用模板（用于不规则遮罩）
        };
        let gl: CanvasRenderingContext2D | WebGLRenderingContext = null;
        //todo 是否使用chrome源码names
        //let contextNames = ["moz-webgl", "webkit-3d", "experimental-webgl", "webgl", "3d"];
        const names = ["webgl", "experimental-webgl"];
        for (let i = 0; i < names.length; ++i) {
            try {
                gl = surface.getContext(names[i], options);
            } catch (e) {
            }
            if (gl) {
                break;
            }
        }
        if (!gl) {
            $error(1021);
        }
        return gl as WebGLRenderingContext;
    }
    sys.getContextWebGL = getContextWebGL;
    /**
     * _getContext2d
     */
    export function getContext2d(surface: HTMLCanvasElement): CanvasRenderingContext2D {
        return surface ? surface.getContext('2d') : null;
    }
    sys.getContext2d = getContext2d;

    /**
     * 创建一个WebGLTexture
     */
    function createTexture(renderContext: RenderContext, bitmapData: BitmapData): WebGLTexture {
        const webglrendercontext = <WebGLRenderContext>renderContext;
        const gl: any = webglrendercontext.context;
        const texture = gl.createTexture() as WebGLTexture;
        if (!texture) {
            //先创建texture失败,然后lost事件才发出来..
            webglrendercontext.contextLost = true;
            return;
        }
        texture[sys.glContext] = gl;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
        texture[sys.UNPACK_PREMULTIPLY_ALPHA_WEBGL] = true;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return texture;
    }
    sys.createTexture = createTexture;

    /**
     * 创建一个WebGLTexture
     */
    function _createTexture(renderContext: RenderContext, width: number, height: number, data: any): WebGLTexture {
        const webglrendercontext = <WebGLRenderContext>renderContext;
        const gl = webglrendercontext.context as WebGLRenderingContext;
        const texture: WebGLTexture = gl.createTexture() as WebGLTexture;
        if (!texture) {
            //先创建texture失败,然后lost事件才发出来..
            webglrendercontext.contextLost = true;
            return null;
        }
        //
        texture[sys.glContext] = gl;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
        texture[sys.UNPACK_PREMULTIPLY_ALPHA_WEBGL] = true;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return texture;
    }
    sys._createTexture = _createTexture;

    /**
     * 画texture
     **/
    function drawTextureElements(renderContext: RenderContext, data: any, offset: number): number {
        const webglrendercontext = <WebGLRenderContext>renderContext;
        const gl: WebGLRenderingContext = webglrendercontext.context;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, data.texture);
        const size = data.count * 3;
        gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
        return size;
    }
    sys.drawTextureElements = drawTextureElements;

    /**
     * 测量文本的宽度
     * @param context 
     * @param text 
     */
    function measureTextWith(context: CanvasRenderingContext2D, text: string): number {
        return context.measureText(text).width;
    }
    sys.measureTextWith = measureTextWith;

    /**
     * 为CanvasRenderBuffer创建一个HTMLCanvasElement
     * @param defaultFunc 
     * @param width 
     * @param height 
     * @param root 
     */
    function createCanvasRenderBufferSurface(defaultFunc: (width?: number, height?: number) => HTMLCanvasElement, width?: number, height?: number, root?: boolean): HTMLCanvasElement {
        return defaultFunc(width, height);
    }
    sys.createCanvasRenderBufferSurface = createCanvasRenderBufferSurface;

    /**
     * 改变渲染缓冲的大小并清空缓冲区
     * @param renderContext 
     * @param width 
     * @param height 
     * @param useMaxSize 
     */
    function resizeCanvasRenderBuffer(renderContext: RenderContext, width: number, height: number, useMaxSize?: boolean): void {
        let canvasRenderBuffer = <CanvasRenderBuffer>renderContext;
        let surface = canvasRenderBuffer.surface;
        if (useMaxSize) {
            let change = false;
            if (surface.width < width) {
                surface.width = width;
                change = true;
            }
            if (surface.height < height) {
                surface.height = height;
                change = true;
            }
            //尺寸没有变化时,将绘制属性重置
            if (!change) {
                canvasRenderBuffer.context.globalCompositeOperation = "source-over";
                canvasRenderBuffer.context.setTransform(1, 0, 0, 1, 0, 0);
                canvasRenderBuffer.context.globalAlpha = 1;
            }
        }
        else {
            if (surface.width != width) {
                surface.width = width;
            }
            if (surface.height != height) {
                surface.height = height;
            }
        }
        canvasRenderBuffer.clear();
    }
    sys.resizeCanvasRenderBuffer = resizeCanvasRenderBuffer;

    setGeolocation(WebGeolocation);
    setMotion(WebMotion);

    /**
     * 
     * @param name 
     * @param path 
     */
    function registerFontMapping(name: string, path: string): void {
        if ((window as any).FontFace) {
            return loadFontByFontFace(name, path);
        } else {
            return loadFontByWebStyle(name, path);
        }
    }
    sys.registerFontMapping = registerFontMapping;

    function loadFontByFontFace(name: string, path: string): void {
        const fontResCache = fontResourceCache;
        if (!fontResCache || !fontResCache[path]) {
            console.egret.warn(`registerFontMapping_WARN: Can not find TTF file:${path}, please load file first.`);
            return;
        }
        const resCache = fontResCache[path];
        const fontFace = new (window as any).FontFace(name, resCache);
        (document as any).fonts.add(fontFace);
        fontFace.load().catch((err) => {
            console.error(`loadFontError:`, err);
        })
    };

    function loadFontByWebStyle(name: string, path: string): void {
        const styleElement = document.createElement("style");
        styleElement.type = "text/css";
        styleElement.textContent = `
            @font-face
            {
                font-family:"${name}";
                src:url("${path}");
            }`;
        styleElement.onerror = (err) => {
            console.error(`loadFontError:`, err);
        }
        document.body.appendChild(styleElement);
    }


    setIsIOS14Device(function () {
        return Capabilities.runtimeType == RuntimeType.WEB
            && Capabilities.os == "iOS"
            && Capabilities.isMobile
            && /iPhone OS 14/.test(window.navigator.userAgent);
    });


