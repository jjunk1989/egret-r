// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

    /** 
     * Returns the fully qualified class name of the base class of the object specified by the value parameter.
     * @param value The object for which a parent class is desired. Any JavaScript value may be passed to this method including
     * all available JavaScript types, object instances, primitive types such as number, and class objects.
     * @returns  A fully qualified base class name, or null if none exists.
     * @example
     * <pre>
     *  egret.getQualifiedSuperclassName(Bitmap) //return "DisplayObject"
     * </pre>
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/utils/getQualifiedSuperclassName.ts
     * @language en_US
     */
    /**
     * 返回 value 参数指定的对象的基类的完全限定类名。
     * @param value 需要取得父类的对象，可以将任何 JavaScript 值传递给此方法，包括所有可用的 JavaScript 类型、对象实例、原始类型（如number）和类对象
     * @returns 完全限定的基类名称，或 null（如果不存在基类名称）。
     * @example
     * <pre>
     *  egret.getQualifiedSuperclassName(Sprite) //返回 "DisplayObject"
     * </pre>
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/utils/getQualifiedSuperclassName.ts
     * @language zh_CN
     */
    export function getQualifiedSuperclassName(value:any):string {
        if (!value || (typeof value != "object" && !value.prototype)) {
            return null;
        }
        let prototype:any = value.prototype ? value.prototype : Object.getPrototypeOf(value);
        let superProto = Object.getPrototypeOf(prototype);
        if (!superProto) {
            return null;
        }
        let superClass = egret.getQualifiedClassName(superProto.constructor);
        if (!superClass) {
            return null;
        }
        return superClass;
    }