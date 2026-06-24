// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret {
    /**
     * Get browser or Runtime parameters, returns an empty string if not set
     * Get the url parameter corresponds to the browser, access to the corresponding parameter in the Runtime setOption
     * @method egret.getOption
     * @param key {string} Parameters key
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * 获取浏览器或者Runtime参数，如果没有设置返回空字符串
     * 在浏览器中相当于获取url中参数，在Runtime获取对应setOption参数
     * @method egret.getOption
     * @param key {string} 参数key
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
    export let getOption:(key:string)=>string;
}