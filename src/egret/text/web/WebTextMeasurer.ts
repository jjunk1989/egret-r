// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { measureTextWith } from "../../player/SystemRenderer";
import { canvasHitTestBuffer } from "../../player/RenderBuffer";

import { CanvasRenderingContext2D } from "../../player/rendering/CanvasRenderer";


    /**
     * @private
     */
    let context: CanvasRenderingContext2D = null;
    /**
     * @private
     */
    let fontCache: any = {};

    /**
     * 测量文本在指定样式下的宽度。
     * @param text 要测量的文本内容。
     * @param fontFamily 字体名称
     * @param fontSize 字体大小
     * @param bold 是否粗体
     * @param italic 是否斜体
     */
    function measureText(text: string, fontFamily: string, fontSize: number, bold: boolean, italic: boolean): number {
        if (!context) {
            createContext();
        }
        let font = "";
        if (italic)
            font += "italic ";
        if (bold)
            font += "bold ";
        font += ((typeof fontSize == "number" && fontSize >= 0) ? fontSize : 12) + "px ";
        font += ((typeof fontFamily == "string" && fontFamily != "") ? fontFamily : "Arial");
        context.font = font;
        return measureTextWith(context, text);
    }

    /**
     * @private
     */
    function createContext(): void {
        context = canvasHitTestBuffer.context;
        context.textAlign = "left";
        context.textBaseline = "middle";
    }

    sys.measureText = measureText;