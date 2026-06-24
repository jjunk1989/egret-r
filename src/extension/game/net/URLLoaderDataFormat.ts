// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret {

	/**
	 * The URLLoaderDataFormat class provides values that specify how downloaded data is received.
     * @see http://edn.egret.com/cn/docs/page/600 Read different data format
     * @version Egret 2.4
     * @platform Web
	 * @includeExample extension/game/net/URLLoaderDataFormat.ts
     * @language en_US
	 */
	/**
	 * URLLoaderDataFormat 类提供了一些用于指定如何接收已下载数据的值。
     * @see http://edn.egret.com/cn/docs/page/600 读取不同数据格式
     * @version Egret 2.4
     * @platform Web
	 * @includeExample extension/game/net/URLLoaderDataFormat.ts
     * @language zh_CN
	 */
    export class URLLoaderDataFormat {

		/**
         * Specify that downloaded data is received as raw binary data.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
		 */
		/**
         * 指定以原始二进制数据形式接收下载的数据。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
		 */
        public static BINARY:string = "binary";

		/**
         * Specify that downloaded data is received as text.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
		 */
		/**
         * 指定以文本形式接收已下载的数据。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
		 */
        public static TEXT:string = "text";

		/**
         * Specify that downloaded data is received as URL-encoded variables.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
		 */
		/**
         * 指定以 URL 编码变量形式接收下载的数据。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
		 */
        public static VARIABLES:string = "variables";

		/**
         * Specify that downloaded data is received as bitmap texture.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
		 */
		/**
         * 指定以位图纹理形式接收已下载的数据。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
		 */
        public static TEXTURE:string = "texture";

        /**
         * Specify that downloaded data is received as sound.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 指定以声音形式接收已下载的数据。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static SOUND:string = "sound";

    }
}