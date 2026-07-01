// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

/**
 * @private
 */
export interface PlayerOption {
    /**
     * 入口类完整类名
     */
    entryClassName?:string;
    /**
     * 默认帧率
     */
    frameRate?:number;
    /**
     * 屏幕适配模式
     */
    scaleMode?:string;
    /**
     * 初始内容宽度
     */
    contentWidth?:number;
    /**
     * 初始内容高度
     */
    contentHeight?:number;
    /**
     * 屏幕方向
     */
    orientation?:string;
    /**
     * 显示FPS
     */
    showFPS?:boolean;
    /**
     *
     */
    fpsStyles?:Object;
    /**
     * 显示日志
     */
    showLog?:boolean;
    /**
     * 过滤日志的正则表达式
     */
    logFilter?:string;
    /**
     *
     */
    maxTouches?:number;
    /**
     *
     */
    textureScaleFactor?:number;
}