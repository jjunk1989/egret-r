// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

    export let fontResourceCache: { [url: string]: any } = {}

        export function setRegisterFontMapping(fn: typeof registerFontMapping) { registerFontMapping = fn; }
export function registerFontMapping(name: string, path: string): void {
        console.error(`empty sys.registerFontMapping = ${name}, ${path}`);
    }
    /**
     * Register font mapping.
     * @param name The font family name to register.
     * @param path The font path.
     * @version Egret 5.3
     * @platform Web
     * @language en_US
     */
    /**
     * 注册字体映射
     * @param name 要注册的字体名称
     * @param path 注册的字体地址
     * @version Egret 5.3
     * @platform Web
     * @language zh_CN
     */
    export declare function registerFontMapping(name: string, path: string): void;


    function _registerFontMapping(name: string, path: string): void {
        registerFontMapping(name, path);
    }

    if (!registerFontMapping) {
        setRegisterFontMapping(_registerFontMapping);
    }