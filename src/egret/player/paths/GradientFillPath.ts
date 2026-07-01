// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { Path2D } from "./Path2D";
import { Matrix } from "../../geom/Matrix";

    /**
     * @private
     * 渐变填充路径
     */
    export class GradientFillPath extends Path2D {

        public constructor(){
            super();
            this.type = PathType.GradientFill;
        }

        public gradientType:string;

        public colors:number[];

        public alphas:number[];

        public ratios:number[];

        public matrix:Matrix;
    }