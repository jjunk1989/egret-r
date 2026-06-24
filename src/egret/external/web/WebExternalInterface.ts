// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret.web {
    /**
     * @private
     */
    export class WebExternalInterface implements ExternalInterface {
        /**
         * @private
         * @param functionName
         * @param value
         */
        static call(functionName:string, value:string):void {
        }

        /**
         * @private
         * @param functionName
         * @param listener
         */
        static addCallback(functionName:string, listener:(value)=>void):void {
        }
    }

    let ua:string = navigator.userAgent.toLowerCase();

    if (ua.indexOf("egretnative") < 0) {
        egret.ExternalInterface = WebExternalInterface;
    }
}

namespace egret.web {
    let callBackDic = {};

    /**
     * @private
     */
    export class NativeExternalInterface implements ExternalInterface {

        static call(functionName:string, value:string):void {
            let data:any = {};
            data.functionName = functionName;
            data.value = value;
            egret_native.sendInfoToPlugin(JSON.stringify(data));
        }

        static addCallback(functionName:string, listener:(value)=>void):void {
            callBackDic[functionName] = listener;
        }
    }

    /**
     * @private
     * @param info
     */
    function onReceivedPluginInfo(info:string):void {
        let data = JSON.parse(info);
        let functionName = data.functionName;
        let listener = callBackDic[functionName];
        if (listener) {
            let value = data.value;
            listener.call(null, value);
        }
        else {
            egret.$warn(1050, functionName);
        }
    }

    let ua:string = navigator.userAgent.toLowerCase();

    if (ua.indexOf("egretnative") >= 0) {
        egret.ExternalInterface = NativeExternalInterface;
        egret_native.receivedPluginInfo = onReceivedPluginInfo;
    }
}

namespace egret.web {
    let callBackDic = {};

    /**
     * @private
     */
    export class WebViewExternalInterface implements ExternalInterface {

        static call(functionName:string, value:string):void {
            __global.ExternalInterface.call(functionName, value);
        }

        static addCallback(functionName:string, listener:(value)=>void):void {
            callBackDic[functionName] = listener;
        }

        static invokeCallback(functionName:string, value:string):void {
            let listener = callBackDic[functionName];
            if (listener) {
                listener.call(null, value);
            }
            else {
                egret.$warn(1050, functionName);
            }
        }        
    }

    let ua:string = navigator.userAgent.toLowerCase();

    if (ua.indexOf("egretwebview") >= 0) {
        egret.ExternalInterface = WebViewExternalInterface;
    }
}