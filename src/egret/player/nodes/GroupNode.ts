// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret.sys {
    /**
     * @private
     * 组渲染节点,用于组合多个渲染节点
     */
    export class GroupNode extends RenderNode {

        /**
         * 相对偏移矩阵。
         */
        public matrix: egret.Matrix;
        
        public constructor() {
            super();
            this.type = RenderNodeType.GroupNode;
        }

        public addNode(node:RenderNode):void {
            this.drawData.push(node);
        }

        /**
         * 覆盖父类方法，不自动清空缓存的绘图数据，改为手动调用clear()方法清空。
         * 这里只是想清空绘制命令，因此不调用super
         */
        public cleanBeforeRender():void {
            let data = this.drawData;
            for (let i = data.length - 1; i >= 0; i--) {
                data[i].cleanBeforeRender();
            }
        }

        public $getRenderCount():number {
            let result = 0;
            let data = this.drawData;
            for (let i = data.length - 1; i >= 0; i--) {
                result += data[i].$getRenderCount();
            }
            return result;
        }
    }
}