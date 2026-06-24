// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret {

    /**
     * The EventPhase class provides values for the eventPhase property of the Event class.
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/events/EventPhase.ts
     * @language en_US
     */
    /**
     * EventPhase 可为 Event 类的 eventPhase 属性提供值。
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/events/EventPhase.ts
     * @language zh_CN
     */
    export const enum EventPhase{

        /**
         * The capturing phase, which is the first phase of the event flow.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 捕获阶段。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        CAPTURING_PHASE = 1,
        /**
         * The target phase, which is the second phase of the event flow.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 目标阶段，是事件流的第二个阶段。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        AT_TARGET = 2,
        /**
         * The bubbling phase, which is the third phase of the event flow.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 冒泡阶段。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        BUBBLING_PHASE = 3
    }
}