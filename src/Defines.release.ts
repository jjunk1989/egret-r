// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { params } from "./extension/assetsmanager/src/processor/Processor";

import { params } from "./extension/assetsmanager/src/processor/Processor";

import { params } from "./extension/assetsmanager/src/processor/Processor";

import { params } from "./extension/assetsmanager/src/processor/Processor";


//此文件仅保证程序中的debug代码能够通过编译，不会生成代码，在JS代码压缩阶段，会移除所有debug代码

/**
 * @private
 */
declare let DEBUG:boolean;
/**
 * @private
 */
declare let RELEASE:boolean;

    /**
     * @private
     */
    export declare function $error(code:number,...params:any[]):void;
    /**
     * @private
     */
    export declare function $warn(code:number,...params:any[]):void;
    /**
     * @private
     */
    export declare function getString(code:number, ...params:any[]):string;
    /**
     * @private
     */
    export declare function $markCannotUse(instance:any, property:string, defaultVale:any):void;

    /**
     * @private
     */
    function _getString():string {
        return "";
    }
    _getString = _getString;

    function _error(code): void {
        throw new Error("#" + code );//使用这种方式报错能够终止后续代码继续运行
    }

    egret.$error = _error;

    function _warn():void {
    }

    $warn = _warn;


    function markCannotUse():void {
    }
    egret.$markCannotUse = markCannotUse;