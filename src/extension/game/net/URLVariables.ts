// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

    /**
     * The URLVariables class allows you to transfer variables between an application and a server.
     * Use URLVariables objects with methods of the URLLoader class and the data property of the URLRequest class.
     * @see http://edn.egret.com/cn/docs/page/598 Send the request with parameters
     * @version Egret 2.4
     * @platform Web
     * @includeExample extension/game/net/URLVariables.ts
     * @language en_US
     */
    /**
     * 使用 URLVariables 类可以在应用程序和服务器之间传输变量。
     * 将 URLVariables 对象与 URLLoader 类的方法、URLRequest 类的 data 属性一起使用。
     * @see http://edn.egret.com/cn/docs/page/598 发送带参数的请求
     * @version Egret 2.4
     * @platform Web
     * @includeExample extension/game/net/URLVariables.ts
     * @language zh_CN
     */

import { egret } from '@egret-r/core';
const { HashObject } = egret;
    export class URLVariables extends HashObject {

        /**
         * Create an egret.URLVariable object
         * @param source {String} A URL-encoded string containing name/value pairs.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 创建一个 egret.URLVariables 对象
         * @param source {String} 包含名称/值对的 URL 编码的字符串。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public constructor(source:string = null) {
            super();
            if (source !== null) {
                this.decode(source);
            }
        }

        /**
         * Key-value pair data object saved in this URLVariables object
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 此 URLVariables 储存的键值对数据对象。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public variables:Object = null;

        /**
         * Convert the variable string into the property of this URLVariables.variables object.
         * @param source {string}
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 将变量字符串转换为此 URLVariables.variables 对象的属性。
         * @param source {string}
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public decode(source:string):void {
            if (!this.variables) {
                this.variables = {};
            }
            source = source.split("+").join(" ");
            let tokens, re = /[?&]?([^=]+)=([^&]*)/g;
            while (tokens = re.exec(source)) {
                let key = decodeURIComponent(tokens[1]),
                    val = decodeURIComponent(tokens[2]);
                //没有重复键值，直接赋值
                if ((key in this.variables) == false) {
                    this.variables[key] = val;
                    continue;
                }
                //有重复键值，如果已经存在数组，直接push到数组，否则创建一个新数组
                let value = this.variables[key];
                if (value instanceof Array) {
                    (<Array<string>>value).push(val)
                }
                else {
                    this.variables[key] = [value, val];
                }
            }
        }

        /**
         * Return a string containing all enumerable variables using  the MIME content encoding format : application/x-www-form-urlencoded.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 以 MIME 内容编码格式 application/x-www-form-urlencoded 返回包含所有可枚举变量的字符串。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public toString():string {
            if (!this.variables) {
                return "";
            }
            let variables:any = this.variables;
            let stringArray:string[] = [];
            for (let key in variables) {
                stringArray.push(this.encodeValue(key, variables[key]));
            }
            return stringArray.join("&");
        }

        /**
         * @private
         * 
         * @param key 
         * @param value 
         */
        private encodeValue(key:string, value:any) {
            if (value instanceof Array) {
                return this.encodeArray(key, value);
            }
            else {
                return encodeURIComponent(key) + "=" + encodeURIComponent(value);
            }
        }

        /**
         * @private
         * 
         * @param key 
         * @param value 
         */
        private encodeArray(key:string, value:string[]) {
            if (!key)
                return "";
            if (value.length == 0) {
                return encodeURIComponent(key) + "=";
            }
            return value.map(v=> encodeURIComponent(key) + "=" + encodeURIComponent(v)).join("&");
        }
    }