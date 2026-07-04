// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


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

    function _error(code: number): void {
        throw new Error("#" + code );//使用这种方式报错能够终止后续代码继续运行
    }

    (egret as any).$error = _error;

    function _warn():void {
    }

    (globalThis as any).$warn = _warn;


    function markCannotUse():void {
    }
    (egret as any).$markCannotUse = markCannotUse;