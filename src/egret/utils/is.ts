// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { Sprite } from "../display/Sprite";
import { log } from "../system/Console";
import { DisplayObjectContainer } from "../display/DisplayObjectContainer";
import { Bitmap } from "../display/Bitmap";
import { registerClass } from "./registerClass";

    /**
     * Indicates whether an object is a instance of the class or interface specified as the parameter.This method has better performance
     * compared width the instanceOf operator,and it can indicate whether an object is a instance of the specific interface.
     * @param instance the instance to be checked.
     * @param typeName the string value representing a specific class or interface.
     * @returns A value of true if the object is a instance of the class or interface specified as the parameter.
     * @example
     * <pre>
     *     let instance = new Sprite();
     *     log(_is(instance,"Sprite"))  //true
     *     log(_is(instance,"DisplayObjectContainer"))  //true
     *     log(_is(instance,"Bitmap"))  //false
     * </pre>
     * @see registerClass()
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * 检查指定对象是否为 Egret 框架内指定接口或类或其子类的实例。此方法与使用 instanceOf 关键字相比具有更高的性能，并且能判断接口的实现。
     * @param instance 要判断的实例。
     * @param typeName 类或接口的完全名称.
     * @returns 返回true表示当前对象是指定类或接口的实例。
     * @example
     * <pre>
     *     let instance = new Sprite();
     *     log(_is(instance,"Sprite"))  //true
     *     log(_is(instance,"DisplayObjectContainer"))  //true
     *     log(_is(instance,"Bitmap"))  //false
     * </pre>
     * @see registerClass()
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
    export function is(instance:any, typeName:string):boolean {
        if (!instance || typeof instance != "object") {
            return false;
        }
        let prototype:any = Object.getPrototypeOf(instance);
        let types = prototype ? prototype.__types__ : null;
        if (!types) {
            return false;
        }
        return (types.indexOf(typeName) !== -1);
    }
    export const _is = is;