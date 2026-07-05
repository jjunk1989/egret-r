// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


import { egret } from '@egret-r/core';
const { $TempRectangle, $TempPoint } = egret;
import { RangeKeys } from "./supportClasses/Range";
import { SliderBase } from "./supportClasses/SliderBase";

    /**
     * The HSlider (horizontal slider) control lets users select a value
     * by moving a slider thumb between the end points of the slider track.
     * The current value of the slider is determined by the relative location of the thumb between
     * the end points of the slider, corresponding to the slider's minimum and maximum values.
     *
     * @includeExample  extension/eui/components/HSliderExample.ts
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 使用 HSlider（水平滑块）控件，用户可通过在滑块轨道的端点之间移动滑块来选择值。
     * 滑块的当前值由滑块端点（对应于滑块的最小值和最大值）之间滑块的相对位置确定。
     *
     * @includeExample  extension/eui/components/HSliderExample.ts
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @language zh_CN
     */
    export class HSlider extends SliderBase {

        /**
         * Constructor.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 构造函数。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public constructor() {
            super();
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected pointToValue(x:number, y:number):number {
            if (!this.thumb || !this.track)
                return 0;
            let values = this.$Range;
            let range = values[RangeKeys.maximum] - values[RangeKeys.minimum];
            let thumbRange = this.getThumbRange();
            return values[RangeKeys.minimum] + (thumbRange != 0 ? (x / thumbRange) * range : 0);
        }

        /**
         * @private
         * 
         * @returns 
         */
        private getThumbRange():number {
            let bounds = $TempRectangle;
            this.track.getLayoutBounds(bounds);
            let thumbRange = bounds.width;
            this.thumb.getLayoutBounds(bounds);
            return thumbRange - bounds.width;
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        protected updateSkinDisplayList():void {
            if (!this.thumb || !this.track)
                return;
            let values = this.$Range;
            let thumbRange = this.getThumbRange();
            let range = values[RangeKeys.maximum] - values[RangeKeys.minimum];
            let thumbPosTrackX = (range > 0) ? ((this.pendingValue - values[RangeKeys.minimum]) / range) * thumbRange : 0;
            let thumbPos = this.track.localToGlobal(thumbPosTrackX, 0, $TempPoint);
            let thumbPosX = thumbPos.x;
            let thumbPosY = thumbPos.y;
            let thumbPosParentX = this.thumb.$parent.globalToLocal(thumbPosX, thumbPosY, $TempPoint).x;

            let bounds = $TempRectangle;
            this.thumb.getLayoutBounds(bounds);
            this.thumb.setLayoutBoundsPosition(Math.round(thumbPosParentX), bounds.y);
            if (this.trackHighlight && this.trackHighlight.$parent) {
                let trackHighlightX = this.trackHighlight.$parent.globalToLocal(thumbPosX, thumbPosY, $TempPoint).x - thumbPosTrackX;
                this.trackHighlight.x = Math.round(trackHighlightX);
                this.trackHighlight.width = Math.round(thumbPosTrackX);
            }
        }
    }
