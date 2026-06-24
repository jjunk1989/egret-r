// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

/**
 * @private
 */
interface AudioBufferSourceNodeEgret {
    buffer:any;
    context:any;
    onended:Function;
    stop(when?:number): void;
    noteOff(when?:number): void;
    addEventListener(type:string, listener:Function, useCapture?:boolean);
    removeEventListener(type:string, listener:Function, useCapture?:boolean);
    disconnect();
}

namespace egret.web {

    /**
     * @private
     */
    export class WebAudioDecode {
        /**
         * @private
         */
        public static ctx;

        /**
         * @private
         */
        public static decodeArr:any[] = [];
        /**
         * @private
         */
        private static isDecoding:boolean = false;

        /**
         * @private
         *
         */
        static decodeAudios() {
            if (WebAudioDecode.decodeArr.length <= 0) {
                return;
            }
            if (WebAudioDecode.isDecoding) {
                return;
            }
            WebAudioDecode.isDecoding = true;
            let decodeInfo = WebAudioDecode.decodeArr.shift();

            WebAudioDecode.ctx.decodeAudioData(decodeInfo["buffer"], function (audioBuffer) {
                decodeInfo["self"].audioBuffer = audioBuffer;

                if (decodeInfo["success"]) {
                    decodeInfo["success"]();
                }
                WebAudioDecode.isDecoding = false;
                WebAudioDecode.decodeAudios();
            }, function () {
                egret.log('sound decode error')
                if (decodeInfo["fail"]) {
                    decodeInfo["fail"]();
                }
                WebAudioDecode.isDecoding = false;
                WebAudioDecode.decodeAudios();
            });
        }

        /** 解决 ios13 页面切到后台再拉起，声音无法播放 */
        static initAudioContext:Function;

    }

    /**
     * @private
     * @inheritDoc
     */
    export class WebAudioSound extends egret.EventDispatcher implements egret.Sound {
        /**
         * Background music
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 背景音乐
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static MUSIC:string = "music";

        /**
         * EFFECT
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 音效
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static EFFECT:string = "effect";

        /**
         * @private
         */
        public type:string;

        /**
         * @private
         */
        private url:string;
        /**
         * @private
         */
        private loaded:boolean = false;

        /**
         * @private
         * @inheritDoc
         */
        constructor() {
            super();
        }


        /**
         * @private
         */
        private audioBuffer:AudioBuffer;


        public get length():number {
            if (this.audioBuffer) {
                return this.audioBuffer.duration;
            }

            throw new Error ("sound not loaded!");

            //return 0;
        }


        /**
         * @inheritDoc
         */
        public load(url:string):void {
            let self = this;

            this.url = url;

            if (DEBUG && !url) {
                egret.$error(3002);
            }

            let request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.responseType = "arraybuffer";
            request.addEventListener("load", function() {
                var ioError = (request.status >= 400);
                if (ioError) {
                    self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                } else {
                    WebAudioDecode.decodeArr.push({
                        "buffer": request.response,
                        "success": onAudioLoaded,
                        "fail": onAudioError,
                        "self": self,
                        "url": self.url
                    });
                    WebAudioDecode.decodeAudios();
                }
            });
            request.addEventListener("error", function() {
                self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
            });
            request.send();

            function onAudioLoaded():void {
                self.loaded = true;
                self.dispatchEventWith(egret.Event.COMPLETE);
            }

            function onAudioError():void {
                self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
            }
        }

        /**
         * @inheritDoc
         */
        public play(startTime?:number, loops?:number):SoundChannel {
            startTime = +startTime || 0;
            loops = +loops || 0;

            if (DEBUG && this.loaded == false) {
                egret.$error(1049);
            }

            let channel = new WebAudioSoundChannel();
            channel.$url = this.url;
            channel.$loops = loops;
            channel.$audioBuffer = this.audioBuffer;
            channel.$startTime = startTime;
            channel.$play();

            sys.$pushSoundChannel(channel);

            return channel;
        }

        /**
         * @inheritDoc
         */
        public close() {
        }
    }
}
