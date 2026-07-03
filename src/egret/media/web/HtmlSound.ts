// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { EventDispatcher } from "../../events/EventDispatcher";
import { $pushSoundChannel } from "../Sound";
import { Event } from "../../events/Event";
import { IOErrorEvent } from "../../events/IOErrorEvent";
import { SoundChannel } from "../SoundChannel";
import { HtmlSoundChannel } from "./HtmlSoundChannel";
import { $error } from "../../../Defines.debug";
import { DEBUG } from "../../../Defines.debug";


    /**
     * @private
     * @inheritDoc
     */
    export class HtmlSound extends EventDispatcher implements Sound {
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
        public static MUSIC: string = "music";

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
        public static EFFECT: string = "effect";

        /**
         * @private
         */
        public type: string;

        /**
         * @private
         */
        private url: string;
        /**
         * @private
         */
        private originAudio: HTMLAudioElement;
        /**
         * @private
         */
        private loaded: boolean = false;

        /**
         * @private
         * @inheritDoc
         */
        constructor() {
            super();
        }

        public get length(): number {
            if (this.originAudio) {
                return this.originAudio.duration;
            }

            throw new Error("sound not loaded!");

            //return 0;
        }

        private static loadingSoundMap: { [url: string]: HTMLAudioElement } = {};

        /**
         * @inheritDoc
         */
        public load(url: string): void {
            let self = this;

            this.url = url;

            if (DEBUG && !url) {
                $error(3002);
            }
            let audio = new Audio(url);
            audio.addEventListener("canplaythrough", onAudioLoaded);
            audio.addEventListener("error", onAudioError);

            let ua: string = navigator.userAgent.toLowerCase();
            if (ua.indexOf("firefox") >= 0) {//火狐兼容
                audio.autoplay = !0;
                audio.muted = true;
            }
            //edge and ie11
            let ie = ua.indexOf("edge") >= 0 || ua.indexOf("trident") >= 0;
            if (ie) {
                document.body.appendChild(audio);
            }
            audio.load();
            HtmlSound.loadingSoundMap[url] = audio;
            this.originAudio = audio;
            if (HtmlSound.clearAudios[this.url]) {
                delete HtmlSound.clearAudios[this.url];
            }

            function onAudioLoaded(): void {
                delete HtmlSound.loadingSoundMap[url];
                HtmlSound.$recycle(self.url, audio);
                removeListeners();
                if (ua.indexOf("firefox") >= 0) {//火狐兼容
                    audio.pause();
                    audio.muted = false;
                }
                if (ie) {
                    document.body.appendChild(audio);
                }

                self.loaded = true;
                self.dispatchEventWith(Event.COMPLETE);
            }

            function onAudioError(): void {
                removeListeners();
                self.dispatchEventWith(IOErrorEvent.IO_ERROR);
            }

            function removeListeners(): void {
                audio.removeEventListener("canplaythrough", onAudioLoaded);
                audio.removeEventListener("error", onAudioError);
                if (ie) {
                    document.body.removeChild(audio);
                }
            }
        }

        /**
         * @inheritDoc
         */
        public play(startTime?: number, loops?: number): SoundChannel {
            startTime = +startTime || 0;
            loops = +loops || 0;

            if (DEBUG && this.loaded == false) {
                $error(1049);
            }

            let audio = HtmlSound.$pop(this.url);
            if (audio == null) {
                audio = <HTMLAudioElement>this.originAudio.cloneNode();
            }
            else {
                //audio.load();
            }
            audio.autoplay = true;

            let channel = new HtmlSoundChannel(audio);
            channel.$url = this.url;
            channel.$loops = loops;
            channel.$startTime = startTime;
            channel.$play();

            $pushSoundChannel(channel);

            return channel;
        }

        /**
         * @inheritDoc
         */
        public close() {
            if (this.loaded && this.originAudio) {
                this.originAudio.src = "";
            }
            if (this.originAudio)
                this.originAudio = null;
            HtmlSound.$clear(this.url);
            this.loaded = false;
        }

        /**
         * @private
         */
        private static audios: Object = {};
        private static clearAudios: Object = {};

        static $clear(url: string): void {
            HtmlSound.clearAudios[url] = true;
            let array: HTMLAudioElement[] = HtmlSound.audios[url];
            if (array) {
                array.length = 0;
            }
        }

        static $pop(url: string): HTMLAudioElement {
            let array: HTMLAudioElement[] = HtmlSound.audios[url];
            if (array && array.length > 0) {
                return array.pop();
            }
            return null;
        }

        static $recycle(url: string, audio: HTMLAudioElement): void {
            if (HtmlSound.clearAudios[url]) {
                return;
            }
            let array: HTMLAudioElement[] = HtmlSound.audios[url];
            if (HtmlSound.audios[url] == null) {
                array = HtmlSound.audios[url] = [];
            }
            array.push(audio);
        }
    }
