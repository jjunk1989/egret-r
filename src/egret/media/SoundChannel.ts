// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { Event } from "../events/Event";
import { IEventDispatcher } from "../events/IEventDispatcher";


    /**
     * The SoundChannel class controls a sound in an application.
     * Every sound is assigned to a sound channel, and the application
     * can have multiple sound channels that are mixed together.
     * The SoundChannel class contains a stop() method, properties for
     * set the volume of the channel
     *
     * @event egret.Event.SOUND_COMPLETE Dispatch when a sound has finished playing at last time
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/media/Sound.ts
     * @language en_US
     */
    /**
     * SoundChannel 类控制应用程序中的声音。每个声音均分配给一个声道，而且应用程序可以具有混合在一起的多个声道。
     * SoundChannel 类包含 stop() 方法、用于设置音量和监视播放进度的属性。
     *
     * @event egret.Event.SOUND_COMPLETE 音频最后一次播放完成时抛出
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/media/Sound.ts
    * @language zh_CN
    */
    export interface SoundChannel extends IEventDispatcher {

        /**
         * The volume, ranging from 0 (silent) to 1 (full volume).
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 音量范围从 0（静音）至 1（最大音量）。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        volume: number;

        /**
         *  When the sound is playing, the position property indicates
         * in seconds the current point that is being played in the sound file.
         * @version Egret 2.4
         * @platform Web
         * @readOnly
         * @language en_US
         */
        /**
         * 当播放声音时，position 属性表示声音文件中当前播放的位置（以秒为单位）
         * @version Egret 2.4
         * @platform Web
         * @readOnly
         * @language zh_CN
         */
        position: number;

        /**
         * Stops the sound playing in the channel.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 停止在该声道中播放声音。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        stop(): void;
    }