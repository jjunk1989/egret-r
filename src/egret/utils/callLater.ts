// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.



    /**
     * @private
     */
    export let $callLaterFunctionList:any[] = [];
    /**
     * @private
     */
    export let $callLaterThisList:any[] = [];
    /**
     * @private
     */
    export let $callLaterArgsList:any[] = [];

    /**
     * Delay the function to run unless screen is redrawn.
     * @param method {Function} The function to be delayed to run
     * @param thisObject {any} this reference of callback function
     * @param ...args {any} Function parameter list
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/utils/callLater.ts
     * @language en_US
     */
    /**
     * 延迟函数到屏幕重绘前执行。
     * @param method {Function} 要延迟执行的函数
     * @param thisObject {any} 回调函数的this引用
     * @param ...args {any} 函数参数列表
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/utils/callLater.ts
     * @language zh_CN
     */
    export function callLater(method:Function,thisObject:any,...args):void
    {
        $callLaterFunctionList.push(method);
        $callLaterThisList.push(thisObject);
        $callLaterArgsList.push(args);
    }

    /**
     * @private
     * Mutable state for async call scheduling
     */
    export const callAsyncState = {
        functionList: [] as any[],
        thisList: [] as any[],
        argsList: [] as any[],
    };
    /**
     * 异步调用函数
     * @param method {Function} 要异步调用的函数
     * @param thisObject {any} 函数的this引用
     * @param ...args {any} 函数参数列表
     * @private
     */
    export function $callAsync(method:Function,thisObject:any,...args):void
    {
        callAsyncState.functionList.push(method);
        callAsyncState.thisList.push(thisObject);
        callAsyncState.argsList.push(args);
    }