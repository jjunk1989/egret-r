// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace eui.sys {

    /**
     * @private
     */
    export const enum AddPosition {
        /**
         * @private
         * 添加父级容器的底层
         */
        FIRST,
        /**
         * @private
         * 添加在父级容器的顶层
         */
        LAST,
        /**
         * @private
         * 添加在相对对象之前
         */
        BEFORE,
        /**
         * @private
         * 添加在相对对象之后
         */
        AFTER
    }
}

namespace eui {

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
        public apply(host:any, parent:egret.DisplayObjectContainer):void {
            let index:number;
            let relative:egret.DisplayObject = host[this.relativeTo];
            let target:egret.DisplayObject = host[this.target];
            let container:egret.DisplayObjectContainer = this.propertyName ? host[this.propertyName] : parent;
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
            if (egret.is(container, "eui.Component")) {
                (<Skin>(<Component>container).$Component[sys.ComponentKeys.skin]).$elementsContent.push(target);
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
        public remove(host:any,parent:egret.DisplayObjectContainer):void {
            let container:egret.DisplayObjectContainer = this.propertyName ? host[this.propertyName] : parent;
            let target:egret.DisplayObject = host[this.target];
            if (!target || !container)
                return;
            if (target.$parent === container) {
                container.removeChild(target);
            }
            if (egret.is(container, "eui.Component")) {
                let arr = (<Skin>(<Component>container).$Component[sys.ComponentKeys.skin]).$elementsContent;
                let idx = arr.indexOf(target);
                if (idx > -1) {
                    arr.splice(idx, 1);
                }
            }
        }
    }

}

