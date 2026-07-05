// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


import { egret } from '@egret-r/core';
const { Event } = egret;
import { IViewport } from "../../core/IViewport";
import { UIComponent } from "../../core/UIComponent";
import { PropertyEvent } from "../../events/PropertyEvent";
import { Component } from "../Component";

    /**
     * The ScrollBarBase class helps to position
     * the portion of data that is displayed when there is too much data
     * to fit in a display area.
     * The ScrollBarBase class displays a pair of viewport and a thumb.
     * viewport is a instance that implements IViewport.
     *
     * @see IViewport
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * <code>ScrollBarBase</code> 滚动条基类，该类帮助在因数据太多而不能在显示区域完全显示时定位显示的数据部分。
     * ScrollBarBase 类显示视区的一部分和一个指示滑块。
     * 视区是一个IViewport接口实现的实例。
     *
     * @see IViewport
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @language zh_CN
     */
    export class ScrollBarBase extends Component {
        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 创建一个ScrollBarBase实例。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public constructor() {
            super();
        }

        /**
         * [SkinPart] Thumb display object.
         * @skinPart
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * [SkinPart]滑块显示对象。
         * @skinPart
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public thumb:UIComponent = null;

        /**
         * @private
         */
        $viewport:IViewport = null;

        /**
         * The viewport controlled by this scrollbar.
         *
         * If a viewport is specified, then changes to its actual size, content
         * size, and scroll position cause the corresponding ScrollBarBase methods to
         * run:
         * <ul>
         *     <li><code>onViewportResize()</code></li>
         *     <li><code>onPropertyChanged()</code></li>
         * </ul><p/>
         *
         * The VScrollBar and HScrollBar classes override these methods to keep their properties in
         * sync with the viewport.
         *
         * @default null
         * @see VScrollBar
         * @see HScrollBar
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 由该滚动条控制的视区。
         *
         * 如果指定了视区，则对其实际大小、内容大小和滚动位置的更改会导致运行相对应的 ScrollBarBase 方法：
         * <ul>
         *     <li><code>onViewportResize()</code></li>
         *     <li><code>onPropertyChanged()</code></li>
         * </ul><p/>
         *
         * VScrollBar 和 HScrollBar 类需要重写这些方法以保证属性与视区的同步。
         *
         * @default null
         * @see VScrollBar
         * @see HScrollBar
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public get viewport():IViewport {
            return this.$viewport;
        }

        public set viewport(value:IViewport) {
            if (value == this.$viewport) {
                return;
            }
            let viewport = this.$viewport;
            if (viewport)
            {
                viewport.removeEventListener(PropertyEvent.PROPERTY_CHANGE, this.onPropertyChanged,this);
                viewport.removeEventListener(Event.RESIZE, this.onViewportResize,this);
            }
            this.$viewport = value;
            if (value)
            {
                value.addEventListener(PropertyEvent.PROPERTY_CHANGE, this.onPropertyChanged,this);
                value.addEventListener(Event.RESIZE, this.onViewportResize,this);
            }
            this.invalidateDisplayList();
        }

        /**
         * @private
         *
         * @param event
         */
        private onViewportResize(event?:Event):void{
            this.invalidateDisplayList();
        }

        /**
         * Properties of viewport changed.
         * @param event
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 视区属性发生改变。
         * @param event
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        protected onPropertyChanged(event:PropertyEvent):void{

        }
        /**
         * Whether the scrollbar can be autohide.
         * @version Egret 3.0.2
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 是否自动隐藏 scrollbar
         * @version Egret 3.0.2
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public autoVisibility:boolean = true;
    }
