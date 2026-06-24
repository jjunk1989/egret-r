// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret {

    /**
     * The HorizontalAlign class defines the possible values for the horizontal alignment.
     * @see egret.TextField#textAlign
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * HorizontalAlign 类为水平对齐方式定义可能的值。
     * @see egret.TextField#textAlign
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
    export class HorizontalAlign{
        /**
         * Horizontally align content to the left of the container.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 将内容与容器的左侧对齐。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static LEFT:string = "left";

        /**
         * Horizontally align content to the right of the container.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 将内容与容器的右侧对齐。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static RIGHT:string = "right";

        /**
         * Horizontally align content in the center of the container.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 在容器的水平中心对齐内容。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static CENTER: string = "center";

        /**
         * Horizontal alignment with both edges.
         * Note: TextFiled does not support this alignment method.
         * @constant egret.HorizontalAlign.JUSTIFY
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 水平两端对齐。
         * 注意：TextFiled不支持此对齐方式。
         * @constant egret.HorizontalAlign.JUSTIFY
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static JUSTIFY:string = "justify";

        /**
         * Align the content of the child items, relative to the container. This operation will adjust uniformly the size of all the child items to be the Content Width \" of the container \".
         * The Content Width \" of the container \" is the size of the max. child item. If the size of all child items are less than the width of the container, they will be adjusted to the width of the container.
         * Note: TextFiled does not support this alignment method.
         * @constant egret.HorizontalAlign.CONTENT_JUSTIFY
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 相对于容器对子项进行内容对齐。这会将所有子项的大小统一调整为容器的"内容宽度"。
         * 容器的"内容宽度"是最大子项的大小,如果所有子项都小于容器的宽度，则会将所有子项的大小调整为容器的宽度。
         * 注意：TextFiled不支持此对齐方式。
         * @constant egret.HorizontalAlign.CONTENT_JUSTIFY
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static CONTENT_JUSTIFY:string = "contentJustify";

    }
}