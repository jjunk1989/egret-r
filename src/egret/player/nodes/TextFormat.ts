// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret.sys {
    /**
     * @private
     * 文本格式
     */
    export interface TextFormat {
        /**
         * 颜色值
         */
        textColor?:number;
        /**
         * 描边颜色值
         */
        strokeColor?:number;
        /**
         * 字号
         */
        size?:number;
        /**
         * 描边大小
         */
        stroke?:number;
        /**
         * 是否加粗
         */
        bold?:boolean;
        /**
         * 是否倾斜
         */
        italic?:boolean;
        /**
         * 字体名称
         */
        fontFamily?:string;
    }
}