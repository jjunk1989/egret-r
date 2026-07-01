// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

declare var global;
declare var __global;
if (typeof global == 'undefined') {
    var global: any = window;
}
if (typeof __global == 'undefined') {
    var __global = global;
}

let __define = globalThis && (globalThis).__define || function (o, p, g, s) { Object.defineProperty(o, p, { configurable: true, enumerable: true, get: g, set: s }) };


    export type Nullable<T> = T | null;
    
    /**
     * The HashObject class is the base class for all objects in the Egret framework.The HashObject
     * class includes a hashCode property, which is a unique identification number of the instance.
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * Egret顶级对象。框架内所有对象的基类，为对象实例提供唯一的hashCode值。
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
    export interface IHashObject {
        /**
         * a unique identification number assigned to this instance.
         * @version Egret 2.4
         * @platform Web
         * @readOnly
         * @language en_US
         */
        /**
         * 返回此对象唯一的哈希值,用于唯一确定一个对象。hashCode为大于等于1的整数。
         * @version Egret 2.4
         * @platform Web
         * @readOnly
         * @language zh_CN
         */
        hashCode: number;
    }

    /**
     * @private
     * 哈希计数
     */
    export let $hashCount: number = 1;

    /**
     * The HashObject class is the base class for all objects in the Egret framework.The HashObject
     * class includes a hashCode property, which is a unique identification number of the instance.
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * Egret顶级对象。框架内所有对象的基类，为对象实例提供唯一的hashCode值。
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
    export class HashObject implements IHashObject {

        /**
         * Initializes a HashObject
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 创建一个 HashObject 对象
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public constructor() {
            this.$hashCode = $hashCount++;
        }

        /**
         * @private
         */
        $hashCode: number;
        /**
         * a unique identification number assigned to this instance.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 返回此对象唯一的哈希值,用于唯一确定一个对象。hashCode为大于等于1的整数。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public get hashCode(): number {
            return this.$hashCode;
        }
    }