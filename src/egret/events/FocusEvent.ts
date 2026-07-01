// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { Event } from "./Event";

    // export interface TextField{
    //     addEventListener<Z>(type: "focusIn" |
    //                               "focusOut"
    //         , listener: (this: Z, e: FocusEvent) => void, thisObject: Z, useCapture?: boolean, priority?: number);
    //     addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number);
    // }
    /**
     * When the user changes the focus from one object in the display list to another object, the object dispatches a FocusEvent object. Currently only supports input text.
     * Focus events: FocusEvent.FOCUS_IN FocusEvent.FOCUS_OUT
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * 用户将焦点从显示列表中的一个对象更改到另一个对象时，对象将调度 FocusEvent 对象。目前只支持输入文本。
     * 焦点事件：FocusEvent.FOCUS_IN FocusEvent.FOCUS_OUT
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
    export class FocusEvent extends Event {

        /**
         * Gets focus
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 获得焦点
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static FOCUS_IN:"focusIn" = "focusIn";

        /**
         * Loses focus
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 失去焦点
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static FOCUS_OUT:"focusOut" = "focusOut";

        /**
         * Create a egret.FocusEvent objects
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 创建一个 egret.FocusEvent 对象
         * @param type  事件的类型，可以作为 Event.type 访问。
         * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public constructor(type:string, bubbles:boolean = false, cancelable:boolean = false) {
            super(type, bubbles, cancelable);

        }
    }