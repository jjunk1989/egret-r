// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { PropertyEvent } from "../events/PropertyEvent";
import { ScrollBarBase } from "./supportClasses/ScrollBarBase";
import { $TempRectangle } from "../../../egret/geom/Rectangle";


    /**
     * The HScrollBar (horizontal scrollbar) control lets you control
     * the portion of data that is displayed when there is too much data
     * to fit horizontally in a display area.
     *
     * <p>Although you can use the HScrollBar control as a stand-alone control,
     * you usually combine it as part of another group of components to
     * provide scrolling functionality.</p>
     *
     * @includeExample  extension/eui/components/HScrollBarExample.ts
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * HScrollBar（水平 ScrollBar）控件可以在因数据太多而不能在显示区域中以水平方向完全显示时控制显示的数据部分。
     * <p>虽然 HScrollBar 控件可以单独使用，但通常将它与其他组件一起使用来提供滚动功能。</p>
     *
     * @includeExample  extension/eui/components/HScrollBarExample.ts
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @language zh_CN
     */
    export class HScrollBar extends ScrollBarBase {

        /**
         * @inheritDoc
         * 
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
            super.updateDisplayList(unscaledWidth, unscaledHeight);
            let thumb = this.thumb;
            let viewport = this.$viewport;
            if (!thumb || !viewport) {
                return;
            }
            let bounds = $TempRectangle;
            thumb.getPreferredBounds(bounds);
            let thumbWidth = bounds.width;
            let thumbY = bounds.y;
            let hsp = viewport.scrollH;
            let contentWidth = viewport.contentWidth;
            let width = viewport.width;
            if (hsp <= 0) {
                let scaleWidth = thumbWidth * (1-(-hsp) / (width * 0.5));
                scaleWidth = Math.max(5,Math.round(scaleWidth));
                thumb.setLayoutBoundsSize(scaleWidth, NaN);
                thumb.setLayoutBoundsPosition(0, thumbY);
            }
            else if (hsp >= contentWidth - width) {
                let scaleWidth = thumbWidth * (1-(hsp - contentWidth + width) / (width * 0.5));
                scaleWidth = Math.max(5,Math.round(scaleWidth));
                thumb.setLayoutBoundsSize(scaleWidth, NaN);
                thumb.setLayoutBoundsPosition(unscaledWidth - scaleWidth, thumbY);
            }
            else {
                let thumbX = (unscaledWidth-thumbWidth) * hsp / (contentWidth - width);
                thumb.setLayoutBoundsSize(NaN, NaN);
                thumb.setLayoutBoundsPosition(thumbX, thumbY);
            }
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected onPropertyChanged(event:PropertyEvent):void {
            switch (event.property) {
                case "scrollH":
                case "contentWidth":
                    this.invalidateDisplayList();
                    break;
            }
        }
    }
