// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


    /**
     * Transfer number to color character string
     * @param value {number} color value ,such as 0xffffff
     * @returns {string} Color character string, for example, #ffffff.
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/utils/toColorString.ts
     * @language en_US
     */
    /**
     * 转换数字为颜色字符串
     * @param value {number} 颜色值，例如 0xffffff
     * @returns {string} 颜色字符串，例如"#ffffff"。
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/utils/toColorString.ts
     * @language zh_CN
     */
    export function toColorString(value: number): string {
        if (!value || value < 0)
            value = 0;
        if (value > 16777215)
            value = 16777215;

        let color: string = value.toString(16).toUpperCase();
        while (color.length > 6) {
            color = color.slice(1, color.length);
        }
        while (color.length < 6) {
            color = "0" + color;
        }
        return "#" + color;
    }