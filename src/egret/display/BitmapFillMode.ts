// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


    /**
     * The BitmapFillMode class defines the image fill mode of Bitmap.
     * The BitmapFillMode class defines a pattern enumeration for adjusting size. These patterns determine how Bitmap fill the size designated by the layout system.
     * @see http://edn.egret.com/cn/docs/page/134 Texture filling way
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/display/BitmapFillMode.ts
     * @language en_US
     */
    /**
     * BitmapFillMode 类定义Bitmap的图像填充方式。
     * BitmapFillMode 类定义了调整大小模式的一个枚举，这些模式确定 Bitmap 如何填充由布局系统指定的尺寸。
     * @see http://edn.egret.com/cn/docs/page/134 纹理的填充方式
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/display/BitmapFillMode.ts
     * @language zh_CN
     */
    export const BitmapFillMode = {

        /**
         * Repeat the bitmap to fill area.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 重复位图以填充区域。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        REPEAT: "repeat",
        /**
         * Scale bitmap fill to fill area.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 位图填充拉伸以填充区域。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        SCALE: "scale",

        /**
         * The bitmap ends at the edge of the region.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 在区域的边缘处截断不显示位图。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        CLIP: "clip"
    }