// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


//此文件仅在调试版本中加载，发行版中会自动排除这个js文件，并移除代码中的所有DEBUG和RELEASE常量。
//代码中若需要编写只在调试版运行或只在发行版运行的代码，可以参考如下代码块写法：
//
//  if(DEBUG){
//      console.log("debug");
//  }
//  if(RELEASE){
//      console.log("release");
//  }
//
//以上代码块在发行版中会简化只有一个语句的代码块:
//
//  console.log("release");
//

/**
 * Is debug mode.
 * @version Egret 2.5
 * @platform Web
 * @language en_US
 */
/**
 * 是否为 debug 模式。
 * @version Egret 2.5
 * @platform Web
 * @language zh_CN
 */
declare let DEBUG: boolean;
/**
 * Is release mode.
 * @version Egret 2.5
 * @platform Web
 * @language en_US
 */
/**
 * 是否为 release 模式。
 * @version Egret 2.5
 * @platform Web
 * @language zh_CN
 */
declare let RELEASE: boolean;

global.DEBUG = true;
global.RELEASE = false;

namespace egret {
    /**
     * @private
     */
    export declare function $error(code: number, ...params: any[]): void;
    /**
     * @private
     */
    export declare function $warn(code: number, ...params: any[]): void;
    /**
     * @private
     */
    export declare function getString(code: number, ...params: any[]): string;
    /**
     * @private
     */
    export declare function $markCannotUse(instance: any, property: string, defaultVale: any): void;

    /**
     * @private
     */
    function _getString(code: number, ...params: any[]): string {
        return egret.sys.tr.apply(egret.sys, arguments);
    }
    egret.getString = _getString;

    function _error(code: number, ...params: any[]): void {
        let text: string = egret.sys.tr.apply(null, arguments);
        if (DEBUG) {
            egret.sys.$errorToFPS("Error #" + code + ": " + text);
        }
        throw new Error("#" + code + ": " + text);//使用这种方式报错能够终止后续代码继续运行
    }

    egret.$error = _error;

    function _warn(code: number, ...params: any[]): void {
        let text: string = egret.sys.tr.apply(null, arguments);
        if (DEBUG) {
            egret.sys.$warnToFPS("Warning #" + code + ": " + text);
        }
        egret.warn("Warning #" + code + ": " + text);
    }

    egret.$warn = _warn;

    function _markReadOnly(instance: any, property: string, isProperty: boolean = true): void {
        let data: PropertyDescriptor = Object.getOwnPropertyDescriptor(isProperty ? instance.prototype : instance, property);
        if (data == null) {
            console.log(instance);
            return;
        }
        data.set = function (value: any) {
            if (isProperty) {
                egret.$warn(1010, getQualifiedClassName(instance), property);
            }
            else {
                egret.$warn(1014, getQualifiedClassName(instance), property);
            }
        };
        Object.defineProperty(instance.prototype, property, data);
    }


    function markCannotUse(instance: any, property: string, defaultValue: any): void {
        Object.defineProperty(instance.prototype, property, {
            get: function () {
                egret.$warn(1009, getQualifiedClassName(instance), property);
                return defaultValue;
            },
            set: function (value) {
                egret.$error(1009, getQualifiedClassName(instance), property);
            },
            enumerable: true,
            configurable: true
        });
    }
    egret.$markCannotUse = markCannotUse;
}

