// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret.sys {

    /**
     * @private
     */
    export let systemRenderer: SystemRenderer;
    /**
     * @private
     * 用于碰撞检测绘制
     */
    export let canvasRenderer: SystemRenderer;
    /**
     * @private
     * 显示渲染器接口
     */
    export interface SystemRenderer {

        /**
         * 渲染一个显示对象
         * @param displayObject 要渲染的显示对象
         * @param buffer 渲染缓冲
         * @param matrix 要叠加的矩阵
         * @param forRenderTexture 绘制目标是RenderTexture的标志
         * @returns drawCall触发绘制的次数
         */
        render(displayObject: DisplayObject, buffer: RenderBuffer, matrix: Matrix, forRenderTexture?: boolean): number;
        /**
         * 将一个RenderNode对象绘制到渲染缓冲
         * @param node 要绘制的节点
         * @param buffer 渲染缓冲
         * @param matrix 要叠加的矩阵
         * @param forHitTest 绘制结果是用于碰撞检测。若为true，当渲染GraphicsNode时，会忽略透明度样式设置，全都绘制为不透明的。
         */
        drawNodeToBuffer(node: sys.RenderNode, buffer: RenderBuffer, matrix: Matrix, forHitTest?: boolean): void;

        renderClear();
    }
    /**
     * 
     */
    export interface RenderContext {

    }
    /**
     * 创建一个canvas。
     */
    export function mainCanvas(width?: number, height?: number): HTMLCanvasElement {
        console.error(`empty sys.mainCanvas = ${width}, ${height}`);
        return null;
    }

    export function createCanvas(width?: number, height?: number): HTMLCanvasElement {
        console.error(`empty sys.createCanvas = ${width}, ${height}`);
        return null;
    }
    /**
    * 重新设置主canvas的大小
    */
    export function resizeContext(renderContext: RenderContext, width: number, height: number, useMaxSize?: boolean): void {
        console.error(`empty sys.resizeContext = ${renderContext}, ${width}, ${height}, ${useMaxSize}`);
    }
    /**
    * 获得系统的渲染运行时
    */
    export function getContextWebGL(surface: HTMLCanvasElement): WebGLRenderingContext {
        console.error(`empty sys.getContextWebGL = ${surface}`);
        return null;
    }

    export function getContext2d(surface: HTMLCanvasElement): CanvasRenderingContext2D {
        console.error(`empty sys.getContext2d = ${surface}`);
        return null;
    }

    /**
    * 仅通过bitmapData创建纹理
    */
    export function createTexture(renderContext: RenderContext, bitmapData: BitmapData | HTMLCanvasElement): WebGLTexture {
        console.error(`empty sys.createTexture = ${bitmapData}`);
        return null;
    }

    /**
    * 通过 width, height, data创建纹理
    */
    export function _createTexture(renderContext: RenderContext, width: number, height: number, data: any): WebGLTexture {
        console.error(`empty sys._createTexture = ${width}, ${height}, ${data}`);
        return null;
    }

    /**
     * 画texture
     **/
    export function drawTextureElements(renderContext: RenderContext, data: any, offset: number): number {
        console.error(`empty sys.drawTextureElements = ${renderContext}, ${data}, ${offset}`);
        return 0;
    }

    /**
     * 测量文本的宽度
     * @param context 
     * @param text 
     */
    export function measureTextWith(context: CanvasRenderingContext2D, text: string): number {
        console.error(`empty sys.measureTextWith = ${context}, ${text}`);
        return 0;
    }

    /**
     * 为CanvasRenderBuffer创建一个canvas
     * @param defaultFunc 
     * @param width 
     * @param height 
     * @param root 
     */
    export function createCanvasRenderBufferSurface(defaultFunc: (width?: number, height?: number) => HTMLCanvasElement, width?: number, height?: number, root?: boolean): HTMLCanvasElement {
        console.error(`empty sys.createCanvasRenderBufferSurface = ${width}, ${height}`);
        return null;
    }

    /**
     * 改变渲染缓冲的大小并清空缓冲区
     * @param renderContext 
     * @param width 
     * @param height 
     * @param useMaxSize 
     */
    export function resizeCanvasRenderBuffer(renderContext: RenderContext, width: number, height: number, useMaxSize?: boolean): void {
        console.error(`empty sys.resizeContext = ${renderContext}, ${width}, ${height}, ${useMaxSize}`);
    }
}