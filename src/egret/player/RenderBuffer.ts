// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


    /**
     * @private
     * 共享的用于碰撞检测的渲染缓冲
     */
    export let customHitTestBuffer:RenderBuffer;
    export let canvasHitTestBuffer:RenderBuffer;
    export function setCustomHitTestBuffer(v: RenderBuffer) { customHitTestBuffer = v; }
    export function setCanvasHitTestBuffer(v: RenderBuffer) { canvasHitTestBuffer = v; }
    /**
     * @private
     * 渲染缓冲
     */
    export interface RenderBuffer {
        /**
         * 呈现最终绘图结果的画布。
         * @readOnly
         */
        surface:any;

        /**
         * 渲染上下文。
         * @readOnly
         */
        context:any;

        /**
         * 渲染缓冲的宽度，以像素为单位。
         * @readOnly
         */
        width: number;

        /**
         * 渲染缓冲的高度，以像素为单位。
         * @readOnly
         */
        height: number;

        /**
         * 改变渲染缓冲的大小并清空缓冲区
         * @param width 改变后的宽
         * @param height 改变后的高
         * @param useMaxSize 若传入true，则将改变后的尺寸与已有尺寸对比，保留较大的尺寸。
         */
        resize(width:number,height:number,useMaxSize?:boolean):void;

        /**
         * 获取指定区域的像素
         */
        getPixels(x:number,y:number,width?:number,height?:number):number[];

        /**
         * 转换成base64字符串，如果图片（或者包含的图片）跨域，则返回null
         * @param type 转换的类型，如: "image/png","image/jpeg"
         */
        toDataURL(type?: string, ...args: any[]): string;

        /**
         * 清空缓冲区数据
         */
        clear():void;

        /**
         * 销毁渲染缓冲
         */
        destroy():void;
    }

    /**
     * @private
     */
    export let RenderBuffer:{
        /**
         * 创建一个RenderTarget。
         * 注意：若内存不足或创建缓冲区失败，将会抛出错误异常。
         * @param width 渲染缓冲的初始宽
         * @param height 渲染缓冲的初始高
         * @param root 是否为舞台buffer
         */
        new(width?:number, height?:number, root?:boolean):RenderBuffer;
    };

    /**
     * @private
     */
    export let CanvasRenderBuffer:{
        /**
         * 创建一个CanvasRenderBuffer。
         * 注意：若内存不足或创建缓冲区失败，将会抛出错误异常。
         * @param width 渲染缓冲的初始宽
         * @param height 渲染缓冲的初始高
         */
        new(width?:number, height?:number):RenderBuffer;
    };
