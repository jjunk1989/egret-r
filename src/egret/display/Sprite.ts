// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret {
    /**
     * The Sprite class is a basic display list building block: a display list node that can contain children.
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/display/Sprite.ts
     * @language en_US
     */
    /**
     * Sprite 类是基本显示列表构造块：一个可包含子项的显示列表节点。
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/display/Sprite.ts
     * @language zh_CN
     */
    export class Sprite extends DisplayObjectContainer {

        /**
         * Creates a new Sprite instance.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 实例化一个容器
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public constructor() {
            super();
            this.$graphics = new Graphics();
            this.$graphics.$setTarget(this);
        }

        protected createNativeDisplayObject(): void {
            this.$nativeDisplayObject = new egret_native.NativeDisplayObject(egret_native.NativeObjectType.SPRITE);
        }

        /**
         * @private
         */
        $graphics:Graphics;

        /**
         * Specifies the Graphics object belonging to this Shape object, where vector drawing commands can occur.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 获取 Shape 中的 Graphics 对象。可通过此对象执行矢量绘图命令。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public get graphics():Graphics {
            return this.$graphics;
        }

        $hitTest(stageX:number, stageY:number):DisplayObject {
            if (!this.$visible) {
                return null;
            }
            let m = this.$getInvertedConcatenatedMatrix();
            let localX = m.a * stageX + m.c * stageY + m.tx;
            let localY = m.b * stageX + m.d * stageY + m.ty;

            let rect = this.$scrollRect ? this.$scrollRect : this.$maskRect;
            if (rect && !rect.contains(localX, localY)) {
                return null;
            }

            if (this.$mask && !this.$mask.$hitTest(stageX, stageY)) {
                return null;
            }
            let children = this.$children;
            let found = false;
            let target:DisplayObject = null;
            for (let i = children.length - 1; i >= 0; i--) {
                let child = children[i];
                if (child.$maskedObject) {
                    continue;
                }
                target = child.$hitTest(stageX, stageY);
                if (target) {
                    found = true;
                    if(target.$touchEnabled){
                        break;
                    }
                    else{
                        target = null;
                    }
                }
            }
            if (target) {
                if (this.$touchChildren) {
                    return target;
                }
                return this;
            }
            if (found) {
                return this;
            }

            target =  DisplayObject.prototype.$hitTest.call(this, stageX, stageY);
            if (target) {
                target = this.$graphics.$hitTest(stageX, stageY);
            }

            return target;
        }

        /**
         * @private
         */
        $measureContentBounds(bounds:Rectangle):void {
            this.$graphics.$measureContentBounds(bounds);
        }

        /**
         * @private
         */
        public $onRemoveFromStage():void {
            super.$onRemoveFromStage();
            if(this.$graphics) {
                this.$graphics.$onRemoveFromStage();
            }
        }
    }
}