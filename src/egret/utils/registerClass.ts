// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { EventDispatcher } from "../events/EventDispatcher";
import { IEventDispatcher } from "../events/IEventDispatcher";
import { log } from "../system/Console";
import { Bitmap } from "../display/Bitmap";
import { $error } from "../../Defines.debug";
import { DEBUG } from "../../Defines.debug";

    /**
     * Registers the runtime class information for a class.This method adds some strings which represent the class name or
     * some interface names to the class definition. After the registration,you can use is() method to do the type checking
     * for the instance of this class.<br/>
     * Note:If you use the TypeScript programming language, the egret command line tool will automatically generate the registration code line.
     * You don't need to manually call this method.
     *
     * @example the following code shows how to register the runtime class information for the EventDispatcher class and do the type checking:
     * <pre>
     *      egret.registerClass(EventDispatcher,"EventDispatcher",["IEventDispatcher"]);
     *      let dispatcher = new EventDispatcher();
     *      log(is(dispatcher, "IEventDispatcher"));  //true。
     *      log(is(dispatcher, "EventDispatcher"));   //true。
     *      log(is(dispatcher, "Bitmap"));   //false。
     * </pre>
     * @param classDefinition the class definition to be registered.
     * @param className  a unique identification string of the specific class
     * @param interfaceNames a list of unique identification string of the specific interfaces.
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * 为一个类定义注册运行时类信息,用此方法往类定义上注册它自身以及所有接口对应的字符串。
     * 在运行时，这个类的实例将可以使用 is() 方法传入一个字符串来判断实例类型。
     * @example 以下代码演示了如何为EventDispatcher类注册运行时类信息并判断类型：
     * <pre>
     *      //为EventDispatcher类注册运行时类信息，由于它实现了IEventDispatcher接口，这里应同时传入接口名对应的字符串。
     *      egret.registerClass(EventDispatcher,"EventDispatcher",["IEventDispatcher"]);
     *      let dispatcher = new EventDispatcher();
     *      log(is(dispatcher, "IEventDispatcher"));  //true。
     *      log(is(dispatcher, "EventDispatcher"));   //true。
     *      log(is(dispatcher, "Bitmap"));   //false。
     * </pre>
     * 注意：若您使用 TypeScript 来编写程序，egret 命令行会自动帮您生成类信息注册代码行到最终的 Javascript 文件中。因此您不需要手动调用此方法。
     *
     * @param classDefinition 要注册的类定义。
     * @param className 要注册的类名。
     * @param interfaceNames 要注册的类所实现的接口名列表。
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
    export function registerClass(classDefinition: any, className: string, interfaceNames?: string[]): void {
        if (DEBUG) {
            if (!classDefinition) {
                $error(1003, "classDefinition");
            }
            if (!classDefinition.prototype) {
                $error(1012, "classDefinition")
            }
            if (className === void 0) {
                $error(1003, "className");
            }
        }
        let prototype: any = classDefinition.prototype;
        Object.defineProperty(prototype, '__class__', {
            value: className,
            enumerable: false,
            writable: true
        });
        let types = [className];
        if (interfaceNames) {
            types = types.concat(interfaceNames);
        }
        let superTypes = prototype.__types__;
        if (prototype.__types__) {
            let length = superTypes.length;
            for (let i = 0; i < length; i++) {
                let name = superTypes[i];
                if (types.indexOf(name) == -1) {
                    types.push(name);
                }
            }
        }
        Object.defineProperty(prototype, '__types__', {
            value: types,
            enumerable: false,
            writable: true
        });
    }
