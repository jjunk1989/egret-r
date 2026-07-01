// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { DisplayObjectContainer, host } from "../../../egret/display/DisplayObjectContainer";
import { IOverride } from "./IOverride";
import { Skin } from "../components/Skin";


    /**
     * The SetProperty class specifies a property value that is in effect only
     * during the parent view state.
     * You use this class in the <code>overrides</code> property of the State class.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @language en_US
     */

    /**
     * SetProperty 类指定只在父视图状态期间有效的属性值。可以在 State 类的 overrides 属性中使用该类。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @language zh_CN
     */
    export class SetProperty implements IOverride {
        /**
         * Constructor.
         *
         * @param target The object whose property is being set.
         * By default, EUI uses the immediate parent of the State object.
         * @param name The property to set.
         * @param value The value of the property in the view state.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 创建一个SetProperty实例。
         *
         * @param target 要设置其属性的对象。默认情况下，EUI 使用 State 对象的直接父级。
         * @param name 要设置的属性。
         * @param value 视图状态中的属性值。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public constructor(target:string, name:string, value:any) {
            this.target = target;
            this.name = name;
            this.value = value;
        }

        /**
         * he name of the property to change.
         * You must set this property, either in
         * the SetProperty constructor or by setting
         * the property value directly.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 要更改的属性的名称。
         * 这个属性必须设置，在 SetProperty 构造函数中设置或通过直接设置该属性值设置。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public name:string;

        /**
         * The object containing the property to be changed.
         * If the property value is <code>null</code>, EUI uses the
         * immediate parent of the State object.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 包含要更改的属性的对象。如果属性值为 null，则 EUI 将使用 State 对象的直接父级。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public target:string;

        /**
         * The new value for the property.
         *
         * @default undefined
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 属性的新值。
         *
         * @default undefined
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public value:any;

        /**
         * @private
         * 旧的属性值
         */
        private oldValue:any;

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public apply(host:Skin, parent:DisplayObjectContainer):void {
            let obj:any = this.target ? host[this.target] : host;
            if (!obj)
                return;
            this.oldValue = obj[this.name];
            this.setPropertyValue(obj, this.name, this.value, this.oldValue);
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public remove(host:Skin, parent:DisplayObjectContainer):void {
            let obj:any = this.target ? host[this.target] : host;
            if (!obj)
                return;
            this.setPropertyValue(obj, this.name, this.oldValue, this.oldValue);
            this.oldValue = null;
        }

        /**
         * @private
         * 设置属性值
         */
        private setPropertyValue(obj:any, name:string, value:any,
                                 valueForType:any):void {
            if (value === undefined || value === null)
                obj[name] = value;
            else if (typeof(valueForType) == "number")
                obj[name] = +value;
            else if (typeof(valueForType) == "boolean")
                obj[name] = this.toBoolean(value);
            else
                obj[name] = value;
        }

        /**
         * @private
         * 转成Boolean值
         */
        private toBoolean(value:any):boolean {
            if (typeof(value) == "string")
                return value.toLowerCase() == "true";

            return value != false;
        }
    }
