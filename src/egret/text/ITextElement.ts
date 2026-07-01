// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


    /**
     * @private
     * @version Egret 2.4
     * @platform Web
     */
    export interface IHitTextElement {
        /**
         * @version Egret 2.4
         * @platform Web
         */
        lineIndex:number;
        /**
         * @version Egret 2.4
         * @platform Web
         */
        textElementIndex:number;
    }


    /**
     * Text Style
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * 文本样式
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
    export interface ITextStyle {
        /**
         * text color
         * @version Egret 2.4
         * @platform Web
         * @see http://edn.egret.com/cn/docs/page/146 多种样式混合文本的基本结构
         * @language en_US
         */
        /**
         * 颜色值
         * @version Egret 2.4
         * @platform Web
         * @see http://edn.egret.com/cn/docs/page/146 多种样式混合文本的基本结构
         * @language zh_CN
         */
        textColor?:number;
        /**
         * stroke color
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 描边颜色值
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        strokeColor?:number;
        /**
         * size
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 字号
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        size?:number;
        /**
         * stroke width
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 描边大小
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        stroke?:number;
        /**
         * whether bold
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 是否加粗
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        bold?:boolean;
        /**
         * whether italic
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 是否倾斜
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        italic?:boolean;
        /**
         * fontFamily
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 字体名称
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        fontFamily?:string;
        /**
         * Link events or address
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 链接事件或者地址
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        href?:string;
        /**
         * @private
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * @private
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        target?:string;
        /**
         * Is underlined
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 是否加下划线
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        underline?:boolean;
    }

    /**
     * Used to build the basic structure of text with a variety of mixed styles, mainly for setting textFlow property
     * @see http://edn.egret.com/cn/docs/page/146 Text mixed in a variety of style
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * 用于建立多种样式混合文本的基本结构，主要用于设置 textFlow 属性
     * @see http://edn.egret.com/cn/docs/page/146 多种样式文本混合
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
    export interface ITextElement {
        /**
         * String Content
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 字符串内容
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        text:string;
        /**
         * Text Style
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 文本样式
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        style?:ITextStyle;
    }

    /**
     * @private
     * @version Egret 2.4
     * @platform Web
     */
    export interface IWTextElement extends ITextElement {
        /**
         * @version Egret 2.4
         * @platform Web
         */
        width:number;
    }

    /**
     * 文本最终解析的一行数据格式
     * @private
     * @version Egret 2.4
     * @platform Web
     */
    export interface ILineElement {
        /**
         * 文本占用宽度
         * @version Egret 2.4
         * @platform Web
         */
        width:number;
        /**
         * 文本占用高度
         * @version Egret 2.4
         * @platform Web
         */
        height:number;
        /**
         * 当前文本字符总数量（包括换行符）
         * @version Egret 2.4
         * @platform Web
         */
        charNum:number;
        /**
         * 是否含有换行符
         * @version Egret 2.4
         * @platform Web
         */
        hasNextLine:boolean;
        /**
         * 本行文本内容
         * @version Egret 2.4
         * @platform Web
         */
        elements:Array<IWTextElement>;
    }