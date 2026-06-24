// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret.sys {



    /**
     * @private
     * 位图渲染节点
     */
    export class NormalBitmapNode extends RenderNode {

        public constructor() {
            super();
            this.type = RenderNodeType.NormalBitmapNode;
        }
        /**
         * 要绘制的位图
         */
        public image: BitmapData = null;
        /**
         * 控制在缩放时是否对位图进行平滑处理。
         */
        public smoothing: boolean = true;
        /**
         * 图片宽度。WebGL渲染使用
         */
        public imageWidth: number;
        /**
         * 图片高度。WebGL渲染使用
         */
        public imageHeight: number;
        /**
         * 翻转
         */
        public rotated: boolean = false;

        public sourceX: number;
        public sourceY: number;
        public sourceW: number;
        public sourceH: number;
        public drawX: number;
        public drawY: number;
        public drawW: number;
        public drawH: number;

        /**
         * 绘制一次位图
         */
        public drawImage(sourceX: number, sourceY: number, sourceW: number, sourceH: number,
            drawX: number, drawY: number, drawW: number, drawH: number): void {
            let self = this;
            self.sourceX = sourceX;
            self.sourceY = sourceY;
            self.sourceW = sourceW;
            self.sourceH = sourceH;
            self.drawX = drawX;
            self.drawY = drawY;
            self.drawW = drawW;
            self.drawH = drawH;
            self.renderCount = 1;
        }

        /**
         * 在显示对象的$updateRenderNode()方法被调用前，自动清空自身的drawData数据。
         */
        public cleanBeforeRender(): void {
            super.cleanBeforeRender();
            this.image = null;
        }
    }
}