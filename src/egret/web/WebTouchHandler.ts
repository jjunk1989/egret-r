// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { Stage } from "../display/Stage";
import { TouchHandler } from "../player/TouchHandler";
import { HashObject } from "../utils/HashObject";
import { Point, $TempPoint } from "../geom/Point";
import { Capabilities } from "../system/Capabilities";


    /**
     * @private
     */
    export class WebTouchHandler extends HashObject {

        /**
         * @private
         */
        public constructor(stage:Stage, canvas:HTMLCanvasElement) {
            super();
            this.canvas = canvas;
            this.touch = new TouchHandler(stage);
            this.addListeners();
        }

        /**
         * @private
         */
        private canvas:HTMLCanvasElement;
        /**
         * @private
         */
        private touch:TouchHandler;

        /**
         * @private
         * 添加事件监听
         */
        private addListeners():void {
            if (window.navigator.msPointerEnabled) {
                this.canvas.addEventListener("MSPointerDown", (event:any)=> {
                    event.identifier = event.pointerId;
                    this.onTouchBegin(event);
                    this.prevent(event);
                }, false);
                this.canvas.addEventListener("MSPointerMove", (event:any)=> {
                    event.identifier = event.pointerId;
                    this.onTouchMove(event);
                    this.prevent(event);
                }, false);
                this.canvas.addEventListener("MSPointerUp", (event:any)=> {
                    event.identifier = event.pointerId;
                    this.onTouchEnd(event);
                    this.prevent(event);
                }, false);
            }
            else {
                if (!Capabilities.isMobile) {
                    this.addMouseListener();
                }
                this.addTouchListener();
            }
        }

        /**
         * @private
         * 
         */
        private addMouseListener():void {
            this.canvas.addEventListener("mousedown", this.onTouchBegin);
            this.canvas.addEventListener("mousemove", this.onMouseMove);
            this.canvas.addEventListener("mouseup", this.onTouchEnd);
        }

        /**
         * @private
         * 
         */
        private addTouchListener():void {
            this.canvas.addEventListener("touchstart", (event:any)=> {
                const l = event.changedTouches.length;
                for (let i:number = 0; i < l; i++) {
                    this.onTouchBegin(event.changedTouches[i]);
                }
                this.prevent(event);
            }, false);
            this.canvas.addEventListener("touchmove", (event:any)=> {
                const l = event.changedTouches.length;
                for (let i:number = 0; i < l; i++) {
                    this.onTouchMove(event.changedTouches[i]);
                }
                this.prevent(event);
            }, false);
            this.canvas.addEventListener("touchend", (event:any)=> {
                const l = event.changedTouches.length;
                for (let i:number = 0; i < l; i++) {
                    this.onTouchEnd(event.changedTouches[i]);
                }
                this.prevent(event);
            }, false);
            this.canvas.addEventListener("touchcancel", (event:any)=> {
                const l = event.changedTouches.length;
                for (let i:number = 0; i < l; i++) {
                    this.onTouchEnd(event.changedTouches[i]);
                }
                this.prevent(event);
            }, false);
        }

        /**
         * @private
         */
        private prevent(event):void {
            event.stopPropagation();
            if (event["isScroll"] !== true && !this.canvas['userTyping']) {
                event.preventDefault();
            }
        }

        /**
         * @private
         */
        private onTouchBegin = (event:any):void => {
            const location = this.getLocation(event);
            const id = this.getTouchIdentifier(event);
            this.touch.onTouchBegin(location.x, location.y, id);
        }

        private onMouseMove = (event:MouseEvent) => {
            if (event.buttons === 0) {//在外面松开按键
                this.onTouchEnd(event);
            } else {
                this.onTouchMove(event);
            }
        }

        /**
         * @private
         */
        private onTouchMove = (event:any):void => {
            const location = this.getLocation(event);
            const id = this.getTouchIdentifier(event);
            this.touch.onTouchMove(location.x, location.y, id);

        }

        /**
         * @private
         */
        private onTouchEnd = (event:any):void => {
            const location = this.getLocation(event);
            const id = this.getTouchIdentifier(event);
            this.touch.onTouchEnd(location.x, location.y, id);
        }

        /**
         * @private
         * Touch.identifier is read-only in modern browsers, read it instead of writing.
         */
        private getTouchIdentifier(event:any):number {
            return event.identifier !== undefined ? event.identifier : 0;
        }

        /**
         * @private
         */
        private getLocation(event:any):Point {
            const doc = document.documentElement;
            const box = this.canvas.getBoundingClientRect();
            const left = box.left + window.pageXOffset - doc.clientLeft;
            const top = box.top + window.pageYOffset - doc.clientTop;
            const x = event.pageX - left;
            let newx = x;
            const y = event.pageY - top;
            let newy = y;
            if (this.rotation === 90) {
                newx = y;
                newy = box.width - x;
            }
            else if (this.rotation === -90) {
                newx = box.height - y;
                newy = x;
            }
            newx = newx / this.scaleX;
            newy = newy / this.scaleY;
            return $TempPoint.setTo(Math.round(newx), Math.round(newy));
        }

        /**
         * @private
         */
        private scaleX:number = 1;
        /**
         * @private
         */
        private scaleY:number = 1;
        /**
         * @private
         */
        private rotation:number = 0;

        /**
         * @private
         * 更新屏幕当前的缩放比例，用于计算准确的点击位置。
         * @param scaleX 水平方向的缩放比例。
         * @param scaleY 垂直方向的缩放比例。
         */
        public updateScaleMode(scaleX:number, scaleY:number, rotation:number):void {
            this.scaleX = scaleX;
            this.scaleY = scaleY;
            this.rotation = rotation;
        }

        /**
         * @private
         * 更新同时触摸点的数量
         */
        public $updateMaxTouches():void {
            this.touch.$initMaxTouches();
        }
    }