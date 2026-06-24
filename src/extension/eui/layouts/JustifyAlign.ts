// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace eui {
    /**
     * The JustifyAlign class defines the possible values for the
     * <code>horizontalAlign</code> 和 <code>verticalAlign</code> property of
     * Layout class.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @includeExample  extension/eui/layout/JustifyAlignExample.ts
     * @language en_US
     */
    /**
     * JustifyAlign 定义布局类中 horizontalAlign 与 verticalAlign 属性需要的两端对齐常量值。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @includeExample  extension/eui/layout/JustifyAlignExample.ts
     * @language zh_CN
     */
    export class JustifyAlign{
        /**
         * Justify the children with respect to the container.
         * This uniformly sizes all children to be the same size as the
         * container.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 相对于容器对齐子代。这会将所有子代的大小统一调整为与容器相同的尺寸。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public static JUSTIFY:string = "justify";

        /**
         * Content justify the children width/height respect to the container.
         * This uniformly sizes all children to be the content width/height of the container.
         * The content width/height of the container is the size of the largest child.
         * If all children are smaller than the width/height of the container, then
         * all the children will be sized to the width/height of the container.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 相对于容器对子代进行内容对齐。这会将所有子代的大小统一调整为容器的内容宽度/高度。
         * 容器的内容宽度/高度是最大子代的大小。如果所有子代都小于容器的宽度/高度，则会将所有子代的大小调整为容器的宽度/高度。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public static CONTENT_JUSTIFY:string = "contentJustify";
    }
}