// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { TextField } from "./TextField";


    /**
     * The VerticalAlign class defines the possible values for the vertical alignment.
     * @see TextField#verticalAlign
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * VerticalAlign 类为垂直对齐方式定义可能的值。
     * @see TextField#verticalAlign
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
    export class VerticalAlign{

        /**
         * Vertically align content to the top of the container.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 将内容与容器的顶部对齐。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static TOP:string = "top";

        /**
         * Vertically align content to the bottom of the container.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 将内容与容器的底部对齐。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static BOTTOM:string = "bottom";

        /**
         * Vertically align content in the middle of the container.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 在容器的垂直中心对齐内容。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static MIDDLE:string = "middle";

        /**
         * Vertical alignment with both edges
         * Note: TextFiled does not support this alignment method."
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 垂直两端对齐
         * 注意：TextFiled不支持此对齐方式。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static JUSTIFY:string = "justify";

        /**
         * Align the content of the child items, relative to the container. This operation will adjust uniformly the size of all the child items to be the Content Height \" of the container \".
         * The Content Height \" of the container \" is the size of the max. child item. If the size of all child items are less than the height of the container, they will be adjusted to the height of the container.
         * Note: TextFiled does not support this alignment method.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 相对于容器对子项进行内容对齐。这会将所有子项的大小统一调整为容器的"内容高度"。
         * 容器的"内容高度"是最大子项的大小,如果所有子项都小于容器的高度，则会将所有子项的大小调整为容器的高度。
         * 注意：TextFiled不支持此对齐方式。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static CONTENT_JUSTIFY:string = "contentJustify";
    }