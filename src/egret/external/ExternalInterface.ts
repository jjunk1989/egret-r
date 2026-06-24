// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret {
    /**
     * h5 and native interaction.
     * @see http://edn.egret.com/cn/article/index/id/714 Egret basic skills to communicate with Native
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/external/ExternalInterface.ts
     * @language en_US
     */
    /**
     * h5与native交互。
     * @see http://edn.egret.com/cn/article/index/id/714 Egret 与 Native 通信基本技巧
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/external/ExternalInterface.ts
     * @language zh_CN
     */
    export interface ExternalInterface {

    }

    export let ExternalInterface: {
        /**
         * Call functionName, and the value passed to the native.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 调用 functionName，并将value传入到native中。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        call(functionName:string, value:string):void;

        /**
         * FunctionName callback listener, you need to have to call functionName this field in native rather than such a call.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 监听 functionName 回调，需要在native中有调用 functionName 这个字段，而不是 此类的call。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        addCallback(functionName:string, listener:(value:string)=>void):void
    };
}