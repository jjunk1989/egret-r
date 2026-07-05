// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


import { egret } from '@egret-r/core';
const { Point, TouchEvent } = egret;
import { ScrollTween } from "./ScrollTween";

    /**
     * @private
     * @version Egret 2.4
     * @platform Web
     */
    export class ScrollViewProperties {
        /**
         * @private
         */
        public _verticalScrollPolicy:string = "auto";
        /**
         * @private
         */
        public _horizontalScrollPolicy:string = "auto";
        /**
         * @private
         */
        public _scrollLeft = 0;
        /**
         * @private
         */
        public _scrollTop:number = 0;

        /**
         * @private
         */
        public _hCanScroll:boolean = false;
        /**
         * @private
         */
        public _vCanScroll:boolean = false;

        /**
         * @private
         */
        public _lastTouchPosition:Point = new Point(0, 0);
        /**
         * @private
         */
        public _touchStartPosition:Point = new Point(0, 0);
        /**
         * @private
         */
        public _scrollStarted:boolean = false;
        /**
         * @private
         */
        public _lastTouchTime:number = 0;
        /**
         * @private
         */
        public _lastTouchEvent:TouchEvent = null;
        /**
         * @private
         */
        public _velocitys:Array<{ x: number; y: number }> = [];
        /**
         * @private
         */
        public _isHTweenPlaying:boolean = false;
        /**
         * @private
         */
        public _isVTweenPlaying:boolean = false;
        /**
         * @private
         */
        public _hScrollTween:ScrollTween = null;
        /**
         * @private
         */
        public _vScrollTween:ScrollTween = null;

        /**
         * @private
         */
        public _bounces: boolean = true;
    }