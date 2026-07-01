// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { HttpRequest } from "../events/IOErrorEvent";


    /**
     * The HttpResponseType class provides values that specify how downloaded data is received.
     * @see HttpRequest
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * URLLoaderDataFormat 类提供了一些用于指定如何接收已下载数据的值。
     * @see HttpRequest
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
    export class HttpResponseType{

        /**
         * Specifies that downloaded data is received as text. This is the default value of HttpRequest.responseType
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 返回字符串。HttpRequest.responseType属性的默认值。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static TEXT:string = "text";
        /**
         * Specifies that downloaded data is received as raw binary data.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 返回二进制的ArrayBuffer对象。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static ARRAY_BUFFER:string = "arraybuffer";

    }