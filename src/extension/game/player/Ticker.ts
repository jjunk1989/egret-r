// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


import { egret } from '@egret-r/core';
const { EventDispatcher, ticker, getTimer, startTick, stopTick } = egret;
import { $error } from "../../../Defines.debug";
import { DEBUG } from "../../../Defines.debug";

     /**
     * @version Egret 2.4
     * @platform Web
     * @includeExample extension/game/player/Ticker.ts
     * @language en_US
     */
    /**
     * @version Egret 2.4
     * @platform Web
     * @includeExample extension/game/player/Ticker.ts
     * @language zh_CN
     */
    export class Ticker extends EventDispatcher {
        /**
         * @deprecated
         * @version Egret 2.4
         * @platform Web
         */
        public constructor() {
            super();
            if (Ticker.instance != null) {
                if (DEBUG) {
                    $error(1033);
                }
            }

            ticker.$startTick(this.update, this);

            this._lastTime = getTimer();
        }

        private _timeScale:number = 1;
        private _paused:boolean = false;

        private _callIndex:number = -1;
        private _callList:any[];
        private _lastTime:number = 0;
        private update(timeStamp:number):boolean {
            let advancedTime:number = timeStamp - this._lastTime;
            this._lastTime = timeStamp;

            if (this._paused){
                return false;
            }
            let frameTime:number = advancedTime * this._timeScale;

            this._callList = this.callBackList.concat();
            this._callIndex = 0;
            for (; this._callIndex < this._callList.length; this._callIndex++) {
                let eventBin:any = this._callList[this._callIndex];
                eventBin.listener.call(eventBin.thisObject, frameTime);
            }

            this._callIndex = -1;
            this._callList = null;

            return false;
        }

        private callBackList:any[] = [];
        /**
         * 注册帧回调事件，同一函数的重复监听会被忽略。推荐使用 startTick 替代此方法。
         * @method egret.Ticker#register
         * @param listener {Function} 帧回调函数,参数返回上一帧和这帧的间隔时间。示例：onEnterFrame(frameTime:number):void
         * @param thisObject {any} 帧回调函数的this对象
         * @param priority {number} 事件优先级，开发者请勿传递 Number.NEGATIVE_INFINITY 和 Number.POSITIVE_INFINITY
         * @version Egret 2.4
         * @platform Web
         * @deprecated
         */
        public register(listener:Function, thisObject:any, priority:number = 0):void {
            this.$insertEventBin(this.callBackList, "", listener, thisObject, false, priority, false);
        }

        /**
         * 取消侦听enterFrame事件。推荐使用 stopTick 替代此方法。
         * @method egret.Ticker#unregister
         * @param listener {Function} 事件侦听函数
         * @param thisObject {any} 侦听函数的this对象
         * @version Egret 2.4
         * @platform Web
         * @deprecated
         */
        public unregister(listener:Function, thisObject:any):void {
            this.$removeEventBin(this.callBackList, listener, thisObject);
        }

        /**
         * @deprecated
         * @param timeScale {number}
         * @private
         */
        public setTimeScale(timeScale:number):void {
            this._timeScale = timeScale;
        }

        /**
         * @deprecated
         * @method egret.Ticker#getTimeScale
         * @private
         */
        public getTimeScale():number {
            return this._timeScale;
        }

        /**
         * 暂停
         * @deprecated
         * @method egret.Ticker#pause
         */
        public pause():void {
            this._paused = true;
        }

        /**
         * 继续
         * @deprecated
         * @method egret.Ticker#resume
         */
        public resume():void {
            this._paused = false;
        }

        /**
         * @private
         */
        private static instance: Ticker;

        /**
         * @method egret.Ticker.getInstance
         * @returns {Ticker}
         * @version Egret 2.4
         * @platform Web
         * @deprecated
         */
        public static getInstance(): Ticker {
            if (Ticker.instance == null) {
                Ticker.instance = new Ticker();
            }
            return Ticker.instance;
        }
    }

