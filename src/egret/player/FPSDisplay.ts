// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { Stage } from "../display/Stage";

    /**
     * @private
     */
    export interface FPSDisplay {
        /**
         * 更新FPS信息
         */
        update(datas:FPSData):void;

        /**
         * 插入一条log信息
         */
        updateInfo(info: string): void;
        /**
         * 插入一条warn信息
         */
        updateWarn(info: string): void;
        /**
         * 插入一条error信息
         */
        updateError(info: string): void;
    }
    /**
     * @private
     */
    export let FPSDisplay:{
        new (stage:Stage, showFPS:boolean, showLog:boolean, logFilter:string,styles:Object): FPSDisplay
    };
/**
 * @private
 */
export interface FPSData extends Object {
    fps:number;
    draw:number;
    costTicker:number;
    costRender:number;
}