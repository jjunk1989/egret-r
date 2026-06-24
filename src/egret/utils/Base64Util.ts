// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret {
    /**
    * @language en_US
    * The Base64Util class provides methods for encoding and decoding base64.
    * @version Egret 2.4
    * @platform Web
    * @includeExample egret/utils/Base64Util.ts
    */
    /**
     * @language zh_CN
     * Base64Util 类提供用于编解码base64的方法。
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/utils/Base64Util.ts
     */
    export class Base64Util {
        /**
         * @language en_US
         * encode base64.
         * @version Egret 2.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 编码base64。
         * @version Egret 2.4
         * @platform Web
         */
        public static encode(arraybuffer: ArrayBuffer):string {
            let bytes = new Uint8Array(arraybuffer);
            let len = bytes.length;
            let base64 = '';

            for (let i = 0; i < len; i += 3) {
                base64 += chars[bytes[i] >> 2];
                base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
                base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
                base64 += chars[bytes[i + 2] & 63];
            }

            if ((len % 3) === 2) {
                base64 = base64.substring(0, base64.length - 1) + '=';
            } else if (len % 3 === 1) {
                base64 = base64.substring(0, base64.length - 2) + '==';
            }

            return base64;
        }
        /**
         * @language en_US
         * decode base64.
         * @version Egret 2.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 解码base64。
         * @version Egret 2.4
         * @platform Web
         */
        public static decode(base64: string):ArrayBuffer {
            let bufferLength = base64.length * 0.75;
            let len = base64.length;
            let p = 0;
            let encoded1 = 0;
            let encoded2 = 0;
            let encoded3 = 0;
            let encoded4 = 0;

            if (base64[base64.length - 1] === '=') {
                bufferLength--;
                if (base64[base64.length - 2] === '=') {
                    bufferLength--;
                }
            }

            let arraybuffer = new ArrayBuffer(bufferLength),
                bytes = new Uint8Array(arraybuffer);

            for (let i = 0; i < len; i += 4) {
                encoded1 = lookup[base64.charCodeAt(i)];
                encoded2 = lookup[base64.charCodeAt(i + 1)];
                encoded3 = lookup[base64.charCodeAt(i + 2)];
                encoded4 = lookup[base64.charCodeAt(i + 3)];

                bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
                bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
                bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
            }

            return arraybuffer;
        }
    }
}
/**
 * @private
 */
let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
/**
 * @private
 */
let lookup = new Uint8Array(256);

for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
}