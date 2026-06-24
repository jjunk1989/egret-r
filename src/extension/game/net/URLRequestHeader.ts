// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret {

    /**
     * A URLRequestHeader object encapsulates a single HTTP request header and consists of a name/value pair.  URLRequestHeader objects are used in the requestHeaders property of the URLRequest class.
     * Note: Because of browser compatibility, this property has not been achieved in html5
     * @version Egret 2.4
     * @platform Web
     * @includeExample extension/game/net/URLRequestHeader.ts
     * @language en_US
     */
    /**
     * URLRequestHeader 对象封装了一个 HTTP 请求标头并由一个名称/值对组成。URLRequestHeader 对象在 URLRequest 类的 requestHeaders 属性中使用。
     * 注意：由于浏览器兼容性原因，在 html5 中并未实现
     * @version Egret 2.4
     * @platform Web
     * @includeExample extension/game/net/URLRequestHeader.ts
     * @language zh_CN
     */
    export class URLRequestHeader {

        /**
         * HTTP request header name, such as Content-Type
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * HTTP 请求标头名称，如 Content-Type
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public name:string = "";

        /**
         * The values associated with the name property (such as text/plain).
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 与 name 属性相关联的值，如 text/plain
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public value:string = "";

        /**
         * Create an egret.URLRequestHeader object
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 创建一个 egret.URLRequestHeader 对象
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        constructor(name:string, value:string) {
            this.name = name;
            this.value = value;
        }
    }
}