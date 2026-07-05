// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


import { egret } from '@egret-r/core';
const { DisplayObjectContainer } = egret;
import { Binding } from "../binding/Binding";
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
    export class SetStateProperty implements IOverride {
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
        public constructor(host:any, templates:any[], chainIndex:number[], target:any, prop:string) {
            this.host = host;
            this.templates = templates;
            this.chainIndex = chainIndex;
            this.target = target;
            this.prop = prop;
        }

        /**
         * 皮肤对象
         * @private
         */
        private host:any;
        /**
         * @private
         * 绑定的模板列表
         */
        public templates:any[];

        /**
         * @private
         * chainIndex是一个索引列表，每个索引指向templates中的一个值，该值是代表属性链。
         */
        public chainIndex:number[];
        /**
         * 要绑定的对象
         * @private
         */
        private target:any;
        /**
         * 要绑定对象的属性
         * @private
         */
        private prop:string;
        /**
         * 上一次的数据
         * @private
         */
        private oldValue:any;

        /**
         * @inheritDoc
         *
         * @version Egret 3.0
         * @version eui 1.0
         * @platform Web
         */
        public apply(host:Skin, parent:DisplayObjectContainer):void {
            if (!this.target) {
                return;
            }
            let nextOldValue = this.target[this.prop];
            if (this.oldValue) {
                this.setPropertyValue(this.target, this.prop, this.oldValue, this.oldValue);
            }
            if (nextOldValue) {
                this.oldValue = nextOldValue;
            }
            Binding.$bindProperties(this.host, this.templates.concat(), this.chainIndex.concat(), this.target, this.prop);
        }

        /**
         * @inheritDoc
         *
         * @version Egret 3.0
         * @version eui 1.0
         * @platform Web
         */
        public remove(host:Skin, parent:DisplayObjectContainer):void {
            if (!this.target) {
                return;
            }
            let oldValue = this.oldValue;
            if (this.target[this.prop]) {
                this.oldValue = this.target[this.prop];
            }
            if (oldValue) {
                this.setPropertyValue(this.target, this.prop, oldValue, oldValue);
            }
        }

        /**
         * @private
         * 设置属性值
         */
        private setPropertyValue(obj:any, name:string, value:any,
                                 valueForType:any):void {
            if (value === undefined || value === null)
                obj[name] = value;
            else if (typeof (valueForType) == "number")
                obj[name] = +value;
            else if (typeof (valueForType) == "boolean")
                obj[name] = this.toBoolean(value);
            else
                obj[name] = value;
        }

        /**
         * @private
         * 转成Boolean值
         */
        private toBoolean(value:any):boolean {
            if (typeof (value) == "string")
                return value.toLowerCase() == "true";

            return value != false;
        }
    }
