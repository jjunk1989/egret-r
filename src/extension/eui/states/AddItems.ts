// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { DisplayObjectContainer } from "../../../egret/display/DisplayObjectContainer";
import { DisplayObject } from "../../../egret/display/DisplayObject";
import { Component, ComponentKeys } from "../components/Component";
import { IOverride } from "./IOverride";
import { Skin } from "../components/Skin";
import { is } from "../../../egret/utils/is";


    /**
     * @private
     */
    export enum AddPosition {
        FIRST,
        LAST,
        BEFORE,
        AFTER
    }

    sys.AddPosition = AddPosition;


    /**
     * The operation of adding a state to view.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 视图添加状态显示元素操作
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @language zh_CN
     */
    export class AddItems implements IOverride {
        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 创建一个AddItems实例
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public constructor(target:string, propertyName:string, position:number, relativeTo:string) {
            this.target = target;
            this.propertyName = propertyName;
            this.position = position;
            this.relativeTo = relativeTo;
        }

        /**
         * The name of the property that is being added.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 要添加到的属性
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public propertyName:string;

        /**
         * The position to be added. Valid values: "first","last","before","after"
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 添加的位置，有效值为: "first","last","before","after"
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public position:number;

        /**
         * an instance name of relative visual element.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 相对的显示元素的实例名
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public relativeTo:string;

        /**
         * The target instance name.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 目标实例名
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public target:string;

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public apply(host:any, parent:DisplayObjectContainer):void {
            let index:number;
            let relative:DisplayObject = host[this.relativeTo];
            let target:DisplayObject = host[this.target];
            let container:DisplayObjectContainer = this.propertyName ? host[this.propertyName] : parent;
            if (!target || !container)
                return;
            switch (this.position) {
                case sys.AddPosition.FIRST:
                    index = 0;
                    break;
                case sys.AddPosition.LAST:
                    index = -1;
                    break;
                case sys.AddPosition.BEFORE:
                    index = container.getChildIndex(relative);
                    break;
                case sys.AddPosition.AFTER:
                    index = container.getChildIndex(relative) + 1;
                    break;
            }
            if (index == -1){
                index = container.numChildren;
            }
            if (is(container, "Component")) {
                (<Skin>(<Component>container).$Component[ComponentKeys.skin]).$elementsContent.push(target);
            }
            container.addChildAt(target, index);
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public remove(host:any,parent:DisplayObjectContainer):void {
            let container:DisplayObjectContainer = this.propertyName ? host[this.propertyName] : parent;
            let target:DisplayObject = host[this.target];
            if (!target || !container)
                return;
            if (target.$parent === container) {
                container.removeChild(target);
            }
            if (is(container, "Component")) {
                let arr = (<Skin>(<Component>container).$Component[ComponentKeys.skin]).$elementsContent;
                let idx = arr.indexOf(target);
                if (idx > -1) {
                    arr.splice(idx, 1);
                }
            }
        }
    }


