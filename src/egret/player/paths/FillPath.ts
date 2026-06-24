// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret.sys {

    /**
     * @private
     * 填充路径
     */
    export class FillPath extends Path2D {

        public constructor(){
            super();
            this.type = PathType.Fill;
        }

        /**
         * 填充颜色
         */
        public fillColor:number;
        /**
         * 填充透明度
         */
        public fillAlpha:number;
    }
}