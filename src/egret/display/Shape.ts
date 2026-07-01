// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { Graphics } from "./Graphics";
import { DisplayObject } from "./DisplayObject";
import { Rectangle } from "../geom/Rectangle";


    /**
     * This class is used to create lightweight shapes using the drawing application program interface (API). The Shape
     * class includes a graphics property, which lets you access methods from the Graphics class.
     * @see Graphics
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/display/Shape.ts
     * @language en_US
     */
    /**
     * 此类用于使用绘图应用程序编程接口 (API) 创建简单形状。Shape 类含有 graphics 属性，通过该属性您可以访问各种矢量绘图方法。
     * @see Graphics
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/display/Shape.ts
     * @language zh_CN
     */
    export class Shape extends DisplayObject {

        /**
         * Creates a new Shape object.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 创建一个 Shape 对象
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
            this.$nativeDisplayObject = new egret_native.NativeDisplayObject(egret_native.NativeObjectType.GRAPHICS);
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

        /**
         * @private
         */
        $measureContentBounds(bounds:Rectangle):void {
            this.$graphics.$measureContentBounds(bounds);
        }

        $hitTest(stageX:number, stageY:number):DisplayObject {
            let target = super.$hitTest(stageX, stageY);
            if (target == this) {
                target = this.$graphics.$hitTest(stageX, stageY);
            }
            return target;
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
