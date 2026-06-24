// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret {
    /**
     * The JointStyle class is an enumeration of constant values that specify the joint style to use in drawing lines.
     * These constants are provided for use as values in the joints parameter of the egret.Graphics.lineStyle() method.
     * @see egret.Graphics#lineStyle()
     * @version Egret 2.5
     * @platform Web
     * @language en_US
     */
    /**
     * JointStyle 类是指定要在绘制线条中使用的联接点样式的常量值枚举。提供的这些常量用作 egret.Graphics.lineStyle() 方法的 joints 参数中的值。
     * @see egret.Graphics#lineStyle()
     * @version Egret 2.5
     * @platform Web
     * @language zh_CN
     */
    export const JointStyle = {
        /**
         * Specifies beveled joints in the joints parameter of the egret.Graphics.lineStyle() method.
         * @version Egret 2.5
         * @platform Web
         * @language en_US
         */
        /**
         * 在 egret.Graphics.lineStyle() 方法的 joints 参数中指定斜角连接。
         * @version Egret 2.5
         * @platform Web
         * @language zh_CN
         */
        BEVEL: "bevel",
        /**
         * Specifies mitered joints in the joints parameter of the egret.Graphics.lineStyle() method.
         * @version Egret 2.5
         * @platform Web
         * @language en_US
         */
        /**
         * 在 egret.Graphics.lineStyle() 方法的 joints 参数中指定尖角连接。
         * @version Egret 2.5
         * @platform Web
         * @language zh_CN
         */
         MITER : "miter",
        /**
         * Specifies round joints in the joints parameter of the egret.Graphics.lineStyle() method.
         * @version Egret 2.5
         * @platform Web
         * @language en_US
         */
        /**
         * 在 egret.Graphics.lineStyle() 方法的 joints 参数中指定圆角连接。
         * @version Egret 2.5
         * @platform Web
         * @language zh_CN
         */
        ROUND:"round"
    }
}