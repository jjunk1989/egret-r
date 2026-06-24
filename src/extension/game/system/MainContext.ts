// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


namespace egret {
    /**
     * @class egret.MainContext
     * @classdesc
     * MainContext是游戏的核心跨平台接口，组合了多个功能Context，并是游戏启动的主入口
     * @extends egret.EventDispatcher
     * @private
     * @version Egret 2.4
     * @platform Web
     */
    export class MainContext extends egret.EventDispatcher {

        /**
         * @version Egret 2.4
         * @platform Web
         */
        constructor() {
            super();
        }

        /**
         * 渲染Context
         * @member egret.MainContext#rendererContext
         * @version Egret 2.4
         * @platform Web
         */
        //public rendererContext:RendererContext = null;

        /**
         * 触摸Context
         * @member egret.MainContext#touchContext
         * @version Egret 2.4
         * @platform Web
         */
        //public touchContext:TouchContext = null;

        /**
         * 设备divice
         * @member egret.MainContext#deviceContext
         * @version Egret 2.4
         * @platform Web
         */
        //public deviceContext:DeviceContext = null;

        /**
         * 舞台
         * @member egret.MainContext#stage
         * @version Egret 2.4
         * @platform Web
         */
        public get stage(): Stage {
            return egret.sys.$TempStage;
        }

        /**
         * @version Egret 2.4
         * @platform Web
         */
        public static deviceType: string = null;

        /**
         * @version Egret 2.4
         * @platform Web
         */
        public static DEVICE_PC: string = "web";
        /**
         * @version Egret 2.4
         * @platform Web
         */
        public static DEVICE_MOBILE: string = "native";


        // /**
        //  * @private
        //  */
        // public static _runtimeType:string;

        // /**
        //  * @version Egret 2.4
        //  * @platform Web
        //  */
        // public static get runtimeType():string {
        //     egret.$warn(1041, "egret.MainContext.runtimeType", "egret.Capabilities.runtimeType");
        //     return MainContext._runtimeType;
        // }
        // /**
        //  * @version Egret 2.4
        //  * @platform Web
        //  */
        // public static RUNTIME_HTML5:string = "runtimeHtml5";
        // /**
        //  * @version Egret 2.4
        //  * @platform Web
        //  */
        // public static RUNTIME_NATIVE:string = "runtimeNative";



        /**
         * 游戏启动，开启主循环，参考Flash的滑动跑道模型
         * @method egret.MainContext#run
         * @version Egret 2.4
         * @platform Web
         */
        // public run() {
        // }

        /**
         * @private
         */
        private static _instance: egret.MainContext;

        /**
         * @method egret.Ticker.getInstance
         * @returns {Ticker}
         * @version Egret 2.4
         * @platform Web
         */
        public static get instance(): egret.MainContext {
            if (MainContext._instance == null) {
                MainContext._instance = new MainContext();
            }
            return MainContext._instance;
        }
    }
}

/**
 * @private
 */
egret["testDeviceType1"] = function () {
    if (!window["navigator"] || !navigator) {
        return true;
    }
    let ua = navigator.userAgent.toLowerCase();
    return (ua.indexOf('mobile') != -1 || ua.indexOf('android') != -1);
};
egret.MainContext.deviceType = egret["testDeviceType1"]() ? egret.MainContext.DEVICE_MOBILE : egret.MainContext.DEVICE_PC;
delete egret["testDeviceType1"];
