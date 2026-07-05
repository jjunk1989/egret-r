// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

    /**
     * When the movieClip's current frame have a frameLabel, dispatches MovieClipEvent object. FrameLabel Event type: MovieClipEvent.FRAME_LABEL
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
  	/**
     * 当动画的当前帧有事件，将调度 MovieClipEvent 对象。帧事件类型 MovieClipEvent.FRAME_LABEL.
  	 * @version Egret 2.4
     * @platform Web
     * @language zh_CN
  	 */

import { egret } from '@egret-r/core';
const { Event, IEventDispatcher } = egret;
    export class MovieClipEvent extends Event {

        /**
         * TextEvent create an object that contains information about movieClip events.
         * @param type Type of event, you can access the MovieClipEvent.type.
         * @param bubbles Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determine whether the Event object can be canceled. The default value is false.
         * @param frameLabel When the current frame have a frameLabel, the event listeners can access this information through the frameLabel property.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 创建一个 MovieClipEvent 对象，其中包含有关帧事件的信息。
         * @param type 事件的类型，可以作为 MovieClipEvent.type 访问。
         * @param bubbles 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @param frameLabel 动画上的帧事件。事件侦听器可以通过 frameLabel 属性访问此信息。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public constructor(type: string, bubbles: boolean = false, cancelable: boolean = false, frameLabel: string = null) {
            super(type, bubbles, cancelable);
            this.frameLabel = frameLabel;
        }     

        /**
         * Dispatched whenever the current frame have a frameLabel.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 动画的当前帧上有事件时调度
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static FRAME_LABEL: string = "frame_label";

        /**
         * In MovieClipEvent.FRAME_LABEL event, event corresponding string.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 在 MovieClipEvent.FRAME_LABEL 事件中，event对应的字符串。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public frameLabel: string = null;

        /**
         * EventDispatcher object using the specified event object thrown MovieClipEvent. The objects will be thrown in the object cache pool for the next round robin.
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param frameLabel  MovieClipEvent object frameLabel
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 使用指定的EventDispatcher对象来抛出 MovieClipEvent 事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @param target 派发事件目标
         * @param type  事件类型
         * @param frameLabel  MovieClipEvent 对象的 frameLabel 赋值
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static dispatchMovieClipEvent(target: IEventDispatcher, type: string, frameLabel: string = null): boolean {
            let event: MovieClipEvent = Event.create(MovieClipEvent, type);
            event.frameLabel = frameLabel;
            let result = target.dispatchEvent(event);
            Event.release(event);
            return result;
        }
    }
