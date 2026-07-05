// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


import { egret } from '@egret-r/core';
const { Event, IEventDispatcher } = egret;
import { ResourceItem } from "./ResourceItem";
import { ResourceInfo } from "../core/ResourceConfig";

	/**
	 * The events of resource loading.
	 * @version Egret 5.2
	 * @platform Web
	 * @language en_US
	 */
	/**
	 * 资源加载事件。
	 * @version Egret 5.2
	 * @platform Web
	 * @language zh_CN
	 */
	export class ResourceEvent extends Event {
		/**
		 * Failure event for a load item.
		 * @version Egret 5.2
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 一个加载项加载失败事件。
		 * @version Egret 5.2
		 * @platform Web
		 * @language zh_CN
		 */
		public static ITEM_LOAD_ERROR: string = "itemLoadError";
		/**
		 * Configure file to load and parse the completion event. Note: if a configuration file is loaded, it will not be thrown out, and if you want to handle the configuration loading failure, monitor the CONFIG_LOAD_ERROR event.
		 * @version Egret 5.2
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 配置文件加载并解析完成事件。注意：若有配置文件加载失败，将不会抛出此事件，若要处理配置加载失败，请同时监听 CONFIG_LOAD_ERROR 事件。
		 * @version Egret 5.2
		 * @platform Web
		 * @language zh_CN
		 */
		public static CONFIG_COMPLETE: string = "configComplete";
		/**
		 * Configuration file failed to load.
		 * @version Egret 5.2
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 配置文件加载失败事件。
		 * @version Egret 5.2
		 * @platform Web
		 * @language zh_CN
		 */
		public static CONFIG_LOAD_ERROR: string = "configLoadError";
		/**
		 * Delay load group resource loading progress event.
		 * @version Egret 5.2
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 延迟加载组资源加载进度事件。
		 * @version Egret 5.2
		 * @platform Web
		 * @language zh_CN
		 */
		public static GROUP_PROGRESS: string = "groupProgress";
		/**
		 * Delay load group resource to complete event. Note: if you have a resource item loading failure, the event will not be thrown, if you want to handle the group load failure, please listen to the GROUP_LOAD_ERROR event.
		 * @version Egret 5.2
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 延迟加载组资源加载完成事件。注意：若组内有资源项加载失败，将不会抛出此事件，若要处理组加载失败，请同时监听 GROUP_LOAD_ERROR 事件。
		 * @version Egret 5.2
		 * @platform Web
		 * @language zh_CN
		 */
		public static GROUP_COMPLETE: string = "groupComplete";
		/**
		 * Delayed load group resource failed event.
		 * @version Egret 5.2
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 延迟加载组资源加载失败事件。
		 * @version Egret 5.2
		 * @platform Web
		 * @language zh_CN
		 */
		public static GROUP_LOAD_ERROR: string = "groupLoadError";
		/**
		 * Creates an Event object to pass as a parameter to event listeners.
		 * @param type  The type of the event, accessible as Event.type.
		 * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
		 * @param cancelable Determines whether the Event object can be canceled. The default values is false.
		 * @version Egret 5.2
		 * @platform Web
		 * @private
		 * @language en_US
		 */
		/**
		 * 创建一个作为参数传递给事件侦听器的 Event 对象。
		 * @param type  事件的类型，可以作为 Event.type 访问。
		 * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
		 * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
		 * @version Egret 5.2
		 * @platform Web
		 * @private
		 * @language zh_CN
		 */
		public constructor(type: string, bubbles: boolean = false, cancelable: boolean = false) {
			super(type, bubbles, cancelable);
		}
		/**
		 * File number that has been loaded.
		 * @version Egret 5.2
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 已经加载的文件数。
		 * @version Egret 5.2
		 * @platform Web
		 * @language zh_CN
		 */
		public itemsLoaded: number = 0;
		/**
		 * Total file number to load.
		 * @version Egret 5.2
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 要加载的总文件数。
		 * @version Egret 5.2
		 * @platform Web
		 * @language zh_CN
		 */
		public itemsTotal: number = 0;
		/**
		 * Resource group name.
		 * @version Egret 5.2
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 资源组名。
		 * @version Egret 5.2
		 * @platform Web
		 * @language zh_CN
		 */
		public groupName: string = "";
		/**
		 * An item of information that is finished by the end of a load.
		 * @version Egret 5.2
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 一次加载项加载结束的项信息对象。
		 * @version Egret 5.2
		 * @platform Web
		 * @language zh_CN
		 */
		public resItem: ResourceItem;
        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
		 * @method RES.ResourceEvent.dispatchResourceEvent
		 * @param target {IEventDispatcher} 
		 * @param type {string} 
		 * @param groupName {string} 
		 * @param resItem {ResourceItem} 
		 * @param itemsLoaded {number} 
		 * @param itemsTotal {number}
		 * @internal
		 * @version Egret 5.2
		 * @platform Web
		 * @language en_CN
         */
		public static dispatchResourceEvent(target: IEventDispatcher, type: string,
			groupName: string = "", resItem: ResourceInfo | undefined = undefined, itemsLoaded: number = 0, itemsTotal: number = 0): boolean {
			var event: ResourceEvent = Event.create(ResourceEvent, type);
			event.groupName = groupName;
			if (resItem) {
				event.resItem = ResourceItem.convertToResItem(resItem);
			}
			event.itemsLoaded = itemsLoaded;
			event.itemsTotal = itemsTotal;
			var result = target.dispatchEvent(event);
			Event.release(event);
			return result;
		}
	}