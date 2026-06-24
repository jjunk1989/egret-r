// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


namespace egret {
	export interface Stage{
		addEventListener<Z>(type: "orientationChange"
			, listener: (this: Z, e: StageOrientationEvent) => void, thisObject: Z, useCapture?: boolean, priority?: number);
		addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number);
	}
	/**
	 * When the direction of the stage of change, Stage object dispatches StageOrientationEvent object.
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/events/StageOrientationEvent.ts
     * @language en_US
	 */
	/**
	 * 当舞台的方向更改时，Stage 对象将调度 StageOrientationEvent 对象。
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/events/StageOrientationEvent.ts
     * @language zh_CN
	 */
    export class StageOrientationEvent extends Event{

		/**
         * After screen rotation distribute events.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
		 */
		/**
         * 屏幕旋转后派发的事件。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
		 */
        public static ORIENTATION_CHANGE:"orientationChange" = "orientationChange";

		/**
         * Creating contains specific information related to the event and the stage direction of StageOrientationEvent object.
         * @param type Event types:StageOrientationEvent.ORIENTATION_CHANGE
         * @param bubbles It indicates whether the Event object participates in the bubbling stage of the event flow.
         * @param cancelable It indicates whether the Event object can be canceled.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
		 */
		/**
         * 创建包含与舞台方向事件相关的特定信息的 StageOrientationEvent 对象。
         * @param type 事件的类型：StageOrientationEvent.ORIENTATION_CHANGE
         * @param bubbles 表示 Event 对象是否参与事件流的冒泡阶段。
         * @param cancelable 表示是否可以取消 Event 对象。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
		 */
        public constructor(type:string, bubbles:boolean=false, cancelable:boolean=false){
            super(type,bubbles,cancelable);
        }

        /**
         * 派发一个屏幕旋转的事件。
		 * @param target {egret.IEventDispatcher} 派发事件目标
		 * @param type {egret.IEventDispatcher} 派发事件类型
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 派发一个屏幕旋转的事件。
		 * @param target {egret.IEventDispatcher} Distribute event target
		 * @param type {egret.IEventDispatcher} Distribute event type
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static dispatchStageOrientationEvent(target:IEventDispatcher, type:string):boolean {
            let event:IOErrorEvent = Event.create(StageOrientationEvent, type);
            let result = target.dispatchEvent(event);
            Event.release(event);
            return result;
        }
    }
}