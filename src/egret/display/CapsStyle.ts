// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { Graphics } from "./Graphics";


    /**
     * The CapsStyle class is an enumeration of constant values that specify the caps style to use in drawing lines.
     * The constants are provided for use as values in the caps parameter of the Graphics.lineStyle() method.
     * @see Graphics#lineStyle()
     * @version Egret 2.5
     * @platform Web
     * @language en_US
     */
    /**
     * CapsStyle 类是可指定在绘制线条中使用的端点样式的常量值枚举。常量可用作 Graphics.lineStyle() 方法的 caps 参数中的值。
     * @see Graphics#lineStyle()
     * @version Egret 2.5
     * @platform Web
     * @language zh_CN
     */
    export const CapsStyle = {
        /**
         * Used to specify no caps in the caps parameter of the Graphics.lineStyle() method.
         * @version Egret 2.5
         * @platform Web
         * @language en_US
         */
        /**
         * 用于在 Graphics.lineStyle() 方法的 caps 参数中指定没有端点。
         * @version Egret 2.5
         * @platform Web
         * @language zh_CN
         */
        NONE: "none",
        /**
         * Used to specify round caps in the caps parameter of the Graphics.lineStyle() method.
         * @version Egret 2.5
         * @platform Web
         * @language en_US
         */
        /**
         * 用于在 Graphics.lineStyle() 方法的 caps 参数中指定圆头端点。
         * @version Egret 2.5
         * @platform Web
         * @language zh_CN
         */
        ROUND: "round",
        /**
         * Used to specify square caps in the caps parameter of the Graphics.lineStyle() method.
         * @version Egret 2.5
         * @platform Web
         * @language en_US
         */
        /**
         * 用于在 Graphics.lineStyle() 方法的 caps 参数中指定方头端点。
         * @version Egret 2.5
         * @platform Web
         * @language zh_CN
         */
        SQUARE: "square"
    }