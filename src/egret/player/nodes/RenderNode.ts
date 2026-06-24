// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret.sys {
    /**
     * @private
     * 渲染节点类型
     */
    export const enum RenderNodeType {
        /**
         * 位图渲染节点
         */
        BitmapNode = 1,
        /**
         * 文本渲染节点
         */
        TextNode,
        /**
         * 矢量渲染节点
         */
        GraphicsNode,
        /**
         * 组渲染节点
         */
        GroupNode,
        /**
         * Mesh 节点
         */
        MeshNode,
        /**
         * 普通位图渲染节点
         */
        NormalBitmapNode
    }

    /**
     * @private
     * 渲染节点基类
     */
    export class RenderNode {

        /**
         * 节点类型..
         */
        public type:number = 0;
        /**
         * 绘制数据
         */
        public drawData:any[] = [];
        /**
         * 绘制次数
         */
        protected renderCount:number = 0;
        /**
         * 在显示对象的$updateRenderNode()方法被调用前，自动清空自身的drawData数据。
         */
        public cleanBeforeRender():void{
            this.drawData.length = 0;
            this.renderCount = 0;
        }

        public $getRenderCount():number {
            return this.renderCount;
        }
    }
}