// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


namespace egret {
	export interface HttpRequest{
		addEventListener<Z>(type: "ioError"
			, listener: (this: Z, e: IOErrorEvent) => void, thisObject: Z, useCapture?: boolean, priority?: number);
		addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number);
	}
	/**
	 * @classdesc IO流事件，当错误导致输入或输出操作失败时调度 IOErrorEvent 对象。
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/events/IOErrorEvent.ts
     * @language en_US
	 */
	/**
	 * @classdesc IO流事件，当错误导致输入或输出操作失败时调度 IOErrorEvent 对象。
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/events/IOErrorEvent.ts
     * @language zh_CN
	 */
    export class IOErrorEvent extends Event{

		/**
         * io error
         * @version Egret 2.4
         * @platform Web
         * @language en_US
		 */
		/**
         * io发生错误
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
		 */
        public static IO_ERROR:"ioError" = "ioError";

		/**
         * Create a egret.IOErrorEvent objects
         * @param type {string} Type of event, accessible as Event.type.
         * @param bubbles {boolean} Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable {boolean} Determine whether the Event object can be canceled. The default value is false.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
		 */
		/**
         * 创建一个 egret.IOErrorEvent 对象
         * @param type {string} 事件的类型，可以作为 Event.type 访问。
         * @param bubbles {boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable {boolean} 确定是否可以取消 Event 对象。默认值为 false。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
		 */
        public constructor(type:string, bubbles:boolean=false, cancelable:boolean=false){
            super(type,bubbles,cancelable);
        }

        /**
         * EventDispatcher object using the specified event object thrown Event. The objects will be thrown in the object cache pool for the next round robin.
		 * @param target {egret.IEventDispatcher} Distribute event target
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
		 * @param target {egret.IEventDispatcher} 派发事件目标
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static dispatchIOErrorEvent(target:IEventDispatcher):boolean {
            let event:IOErrorEvent = Event.create(IOErrorEvent, IOErrorEvent.IO_ERROR);
            let result = target.dispatchEvent(event);
            Event.release(event);
            return result;
        }
    }
}