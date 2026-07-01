// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

    /**
     * @private
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * @private
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
    export interface ISocket {
        /**
         * 连接
         * @method egret.ISocket#connect
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 连接
         * @method egret.ISocket#connect
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        connect(host:string, port:number):void;

        /**
         * 连接
         * @method egret.ISocket#connect
         */
        connectByUrl(url:string):void;

        /**
         * 
         * @param onConnect 
         * @param onClose 
         * @param onSocketData 
         * @param onError 
         * @param thisObject 
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 
         * @param onConnect 
         * @param onClose 
         * @param onSocketData 
         * @param onError 
         * @param thisObject 
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        addCallBacks(onConnect:Function, onClose:Function, onSocketData:Function, onError:Function, thisObject:any):void;

        /**
         * 
         * @param message 
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 
         * @param message 
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        send(message:any):void;

        /**
         * 
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        close():void;
        /**
         * 
         * @version Egret 4.1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 
         * @version Egret 4.1.0
         * @platform Web
         * @language zh_CN
         */
        disconnect():void;
    }

    /**
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
    export let ISocket: any = undefined;
    export function setISocket(v: any) { ISocket = v; }
