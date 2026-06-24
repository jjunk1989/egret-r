// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret {

	/**
	 * The URLRequestMethod class provides values that specify whether the
     * URLRequest object should use the POST method or the GET method when sending data to a server.
     * @see http://edn.egret.com/cn/docs/page/599 POST与GET
     * @version Egret 2.4
     * @platform Web
	 * @includeExample extension/game/net/URLRequestMethod.ts
     * @language en_US
	 */
	/**
	 * URLRequestMethod 类提供了一些值，这些值可指定在将数据发送到服务器时，
     * URLRequest 对象应使用 POST 方法还是 GET 方法。
     * @see http://edn.egret.com/cn/docs/page/599 POST与GET
     * @version Egret 2.4
     * @platform Web
	 * @includeExample extension/game/net/URLRequestMethod.ts
     * @language zh_CN
	 */
    export class URLRequestMethod {

		/**
         * Specify that the URLRequest object is a GET.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
		 */
		/**
         * 表示 URLRequest 对象是一个 GET。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
		 */
        public static GET:string = "get";

		/**
         * Specify that the URLRequest object is a POST.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
		 */
		/**
         * 表示 URLRequest 对象是一个 POST。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
		 */
        public static POST:string = "post";
    }
}