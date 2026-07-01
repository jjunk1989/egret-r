// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

/**
 * @private
 */

    /**
     * 测量文本在指定样式下的宽度。
     * @param text 要测量的文本内容。
     * @param fontFamily 字体名称
     * @param fontSize 字体大小
     * @param bold 是否粗体
     * @param italic 是否斜体
     */
    export let measureText:(text:string, fontFamily:string, fontSize:number, bold:boolean, italic:boolean)=>number;