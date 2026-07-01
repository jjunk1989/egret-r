// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { HttpRequest } from "../events/IOErrorEvent";


    /**
     * The HttpMethod class provides values that specify whether the HttpRequest object should use the POST method
     * or the GET method when sending data to a server.
     * @see HttpRequest
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * HttpRequestMethod 类提供了一些值，这些值可指定在将数据发送到服务器时，
     * HttpRequest 对象应使用 POST 方法还是 GET 方法。
     * @see HttpRequest
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
    export namespace HttpMethod {

        /**
         * Specifies that the HttpRequest object is a GET.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 表示 HttpRequest 对象是一个 GET。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        export const GET = "GET";

        /**
         * Specifies that the HttpRequest object is a POST.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 表示 HttpRequest 对象是一个 POST。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        export const POST = "POST";
    }