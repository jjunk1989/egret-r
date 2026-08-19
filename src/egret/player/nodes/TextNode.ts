// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { RenderNode, RenderNodeType } from "./RenderNode";
import { TextFormat } from "./TextFormat";
import { WebGLUtils } from "../../web/rendering/webgl/WebGLUtils";


    /**
     * @private
     * 文本渲染节点
     */
    export class TextNode extends RenderNode {

        public constructor() {
            super();
            this.type = RenderNodeType.TextNode;
        }

        /**
         * 颜色值
         */
        public textColor:number = 0xFFFFFF;
        /**
         * 描边颜色值
         */
        public strokeColor:number = 0x000000;
        /**
         * 字号
         */
        public size:number = 30;
        /**
         * 描边大小
         */
        public stroke:number = 0;
        /**
         * 是否加粗
         */
        public bold:boolean = false;
        /**
         * 是否倾斜
         */
        public italic:boolean = false;
        /**
         * 字体名称
         */
        public fontFamily:string = "Arial";

        /**
         * 绘制一行文本
         */
        public drawText(x:number, y:number, text:string, format:TextFormat):void {
            this.drawData.push(x, y, text, format);
            this.renderCount++;
            this.dirtyRender = true;
        }

        //forWebGL
        /**
         * 绘制x偏移
         */
        public x:number;
        /**
         * 绘制y偏移
         */
        public y:number;
        /**
         * 绘制宽度
         */
        public width:number;
        /**
         * 绘制高度
         */
        public height:number;
        /**
         * 脏渲染标记
         */
        public dirtyRender:boolean = true;
        public $texture:WebGLTexture;
        public $textureWidth:number;
        public $textureHeight:number;
        public $canvasScaleX:number;
        public $canvasScaleY:number;

        /**
         * 清除非绘制的缓存数据
         */
        public clean():void {
            if(this.$texture) {
                WebGLUtils.deleteWebGLTexture(this.$texture);
                this.$texture = null;
                this.dirtyRender = true;
            }
        }

        /**
         * 在显示对象的$updateRenderNode()方法被调用前，自动清空自身的drawData数据。
         */
        public cleanBeforeRender():void{
            super.cleanBeforeRender();
            this.dirtyRender = true;
        }

    }