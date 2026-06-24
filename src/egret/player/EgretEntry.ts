// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret {

    export type runEgretOptions = {
        renderMode?: string;
        audioType?: number;
        screenAdapter?: sys.IScreenAdapter;
        antialias?: boolean;
        canvasScaleFactor?: number;
        calculateCanvasScaleFactor?: (context: CanvasRenderingContext2D) => number;
        pro?:boolean;

        /**
         * 以下目前仅供小游戏使用
         * The following are for mini-games only
         */
        entryClassName?: string;
        scaleMode?: string;
        frameRate?: number;
        contentWidth?: number;
        contentHeight?: number;
        orientation?: string;
        maxTouches?: number;
        showFPS?: boolean;
        showLog?: boolean;
        fpsStyles?: string;
    };

    /**
     * egret project entry function
     * @param options An object containing the initialization properties for egret engine.
     * @language en_US
     */
    /**
     * egret工程入口函数
     * @param options 一个可选对象，包含初始化Egret引擎需要的参数。
     * @language zh_CN
     */
    export declare function runEgret(options?: runEgretOptions): void;
    /**
     * Refresh the screen display
     * @language en_US
     */
    /**
     * 刷新屏幕显示
     * @language zh_CN
     */
    export declare function updateAllScreens(): void;
}
