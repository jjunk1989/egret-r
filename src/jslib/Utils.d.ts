// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

declare namespace egret{
    /**
    * @private
    */
    export class Utils {
        static unzip();
        static unzipBase64AsArray(input, bytes);
        static uint8ArrayToUint32Array(uint8Arr);
    }
}

/**
* @private
*/
declare namespace egret.Codec{
    /**
    * @private
    */
    export class Base64 {
        static decodeAsArray(input, bytes);
    }
}

/**
* @private
*/
declare class Zlib{

    static Inflate(obj):void;
}
