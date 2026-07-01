// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { Matrix } from "../../geom/Matrix";
import { RenderNode, RenderNodeType } from "./RenderNode";
import { BitmapData } from "../../display/BitmapData";
import { Rectangle } from "../../geom/Rectangle";
import { ColorMatrixFilter } from "../../filters/ColorMatrixFilter";


    /**
     * @private
     * Mesh 渲染节点
     */
    export class MeshNode extends RenderNode {

        public constructor(){
            super();
            this.type = RenderNodeType.MeshNode;
            this.vertices = [];
            this.uvs = [];
            this.indices = [];
        }
        /**
         * 要绘制的位图
         */
        public image:BitmapData = null;
        /**
         * 控制在缩放时是否对位图进行平滑处理。
         */
        public smoothing:boolean = true;
        /**
         * 图片宽度。WebGL渲染使用
         */
        public imageWidth:number;
        /**
         * 图片高度。WebGL渲染使用
         */
        public imageHeight:number;
        /**
         * 相对偏移矩阵。
         */
        public matrix:Matrix;
        /**
         * UV 坐标。
         */
        public uvs:number[];
        /**
         * 顶点坐标。
         */
        public vertices:number[];
        /**
         * 顶点索引。
         */
        public indices:number[];
        /**
         * 顶点索引。
         */
        public bounds:Rectangle = new Rectangle();
        /**
         * 使用的混合模式
         */
        public blendMode: number = null;
        /**
         * 相对透明度
         */
        public alpha: number = NaN;
        /**
         * 颜色变换滤镜
         */
        public filter: ColorMatrixFilter = null;
        /**
         * 翻转
         */
        public rotated: boolean = false;
        /**
         * 绘制一次位图
         */
        public drawMesh(sourceX:number, sourceY:number, sourceW:number, sourceH:number,
                         drawX:number, drawY:number, drawW:number, drawH:number):void {
            this.drawData.push(sourceX, sourceY, sourceW, sourceH, drawX, drawY, drawW, drawH);
            this.renderCount++;
        }

        /**
         * 在显示对象的$updateRenderNode()方法被调用前，自动清空自身的drawData数据。
         */
        public cleanBeforeRender():void{
            super.cleanBeforeRender();
            this.image = null;
            this.matrix = null;
        }
    }