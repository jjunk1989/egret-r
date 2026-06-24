// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

    /**
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/localStorage/localStorage.ts
     */
namespace egret.localStorage {

    /**
     * Read data
     * @param key {string} Name of the key to be read
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * 读取数据
     * @param key {string} 要读取的键名称
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
    export let getItem:(key:string)=>string;

    /**
     * Save data
     * @param key {string} Name of the key to be saved
     * @param value {string} Value to be saved
     * @returns {boolean} Whether data is saved successfully
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * 保存数据
     * @param key {string} 要保存的键名称
     * @param value {string} 要保存的值
     * @returns {boolean} 数据保存是否成功
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
    export let setItem:(key:string, value:string)=>boolean;

    /**
     * Delete data
     * @param key {string} Name of the key to be deleted
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * 删除数据
     * @param key {string} 要删除的键名称
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
    export let removeItem:(key:string)=>void;

    /**
     * Clear all data
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * 将所有数据清空
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
    export let clear:()=>void;
}