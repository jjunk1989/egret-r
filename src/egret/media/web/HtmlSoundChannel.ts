// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { EventDispatcher } from "../../events/EventDispatcher";
import { $popSoundChannel } from "../Sound";
import { SoundChannel } from "../SoundChannel";
import { Event } from "../../events/Event";
import { $error } from "../../../Defines.debug";
import { HtmlSound } from "./HtmlSound";


    /**
     * @private
     * @inheritDoc
     */
    export class HtmlSoundChannel extends EventDispatcher implements SoundChannel {


        /**
         * @private
         */
        $url:string;
        /**
         * @private
         */
        $loops:number;
        /**
         * @private
         */
        $startTime:number = 0;
        /**
         * @private
         */
        private audio:HTMLAudioElement = null;

        //声音是否已经播放完成
        private isStopped:boolean = false;

        /**
         * @private
         */
        constructor(audio:HTMLAudioElement) {
            super();
            audio.addEventListener("ended", this.onPlayEnd);
            this.audio = audio;
        }

        private canPlay =():void => {
            this.audio.removeEventListener("canplay", this.canPlay);

            try {
                this.audio.currentTime = this.$startTime;
            }
            catch (e) {
            }
            finally {
                this.audio.play();
            }
        };

        $play():void {
            if (this.isStopped) {
                $error(1036);
                return;
            }

            try {
                //this.audio.pause();
                this.audio.volume = this._volume;
                this.audio.currentTime = this.$startTime;
            }
            catch (e) {
                this.audio.addEventListener("canplay", this.canPlay);
                return;
            }
            this.audio.play();
        }

        /**
         * @private
         */
        private onPlayEnd = () => {
            if (this.$loops == 1) {
                this.stop();

                this.dispatchEventWith(Event.SOUND_COMPLETE);
                return;
            }

            if (this.$loops > 0) {
                this.$loops--;
            }

            /////////////
            //this.audio.load();
            this.$play();
        };

        /**
         * @private
         * @inheritDoc
         */
        public stop() {
            if (!this.audio)
                return;

            if (!this.isStopped) {
                $popSoundChannel(this);
            }
            this.isStopped = true;

            let audio = this.audio;
            audio.removeEventListener("ended", this.onPlayEnd);
            audio.removeEventListener("canplay", this.canPlay);
            audio.volume = 0;
            this._volume = 0;
            this.audio = null;

            let url = this.$url;

            //延迟一定时间再停止，规避chrome报错
            window.setTimeout(function () {
                audio.pause();
                HtmlSound.$recycle(url, audio);
            }, 200);
        }

        /**
         * @private
         */
        private _volume:number = 1;

        /**
         * @private
         * @inheritDoc
         */
        public get volume():number {
            return this._volume;
        }

        /**
         * @inheritDoc
         */
        public set volume(value:number) {
            if (this.isStopped) {
                $error(1036);
                return;
            }
            this._volume = value;
            if (!this.audio)
                return;
            this.audio.volume = value;
        }

        /**
         * @private
         * @inheritDoc
         */
        public get position():number {
            if (!this.audio)
                return 0;
            return this.audio.currentTime;
        }
    }