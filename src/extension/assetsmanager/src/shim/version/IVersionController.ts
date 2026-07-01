// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { Event } from "../../../../../egret/events/Event";
import { IOErrorEvent } from "../../../../../egret/events/IOErrorEvent";

    /**
     * Version control loading interface
     * @version Egret 2.4
     * @platform Web
     * @includeExample extension/version/VersionControl.ts
     * @language en_US
     */
    /**
     * 版本控制加载的接口
     * @version Egret 2.4
     * @platform Web
     * @includeExample extension/version/VersionControl.ts
     * @language zh_CN
     */
    export interface IVersionController {
        /**
         * Get the version information data.<br/>
         * Before calling this method requires the application of any resource load, we recommend starting at the application entry class (Main) The first call processing. This method is only responsible for acquiring version information, is not responsible for downloaded resources.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 获取版本信息数据。<br/>
         * 这个方法的调用需要在应用程序进行任何资源加载之前，建议在应用程序的入口类（Main）的开始最先进行调用处理。此方法只负责获取版本信息，不负责资源的下载。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        init(): Promise<any>;
        /**
         * Get the actual URL of the resource file.<br/>
         * Because this method needs to be called to control the actual version of the URL have the original resource files were changed, so would like to get the specified resource file the actual URL.<br/>
         * In the development and debugging phase, this method will directly return value passed.
         * @param url Url used in the game
         * @returns Actual loaded url
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 获取资源文件实际的URL地址。<br/>
         * 由于版本控制实际已经对原来的资源文件的URL进行了改变，因此想获取指定资源文件实际的URL时需要调用此方法。<br/>
         * 在开发调试阶段，这个方法会直接返回传入的参数值。
         * @param url 游戏中使用的url
         * @returns 实际加载的url
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        getVirtualUrl(url: string): string;
    }

    /**
     * Manage version control class
     * @version Egret 2.4
     * @platform Web
     * @event Event.COMPLETE Version control loading is complete when thrown
     * @event IOErrorEvent.IO_ERROR Version control failed to load when thrown
     * @includeExample extension/version/VersionControl.ts
     * @language en_US
     */
    /**
     * 管理版本控制的类
     * @version Egret 2.4
     * @platform Web
     * @event Event.COMPLETE 版本控制加载完成时抛出
     * @event IOErrorEvent.IO_ERROR 版本控制加载失败时抛出
     * @includeExample extension/version/VersionControl.ts
     * @language zh_CN
     */
    export interface VersionController extends IVersionController {

    }
    /**
     * @version Egret 2.4
     * @platform Web
     */
    export let VersionController: {
        /**
         * Constructor initialization
         * @language en_US
         */
        /**
         * 初始化构造函数
         * @language zh_CN
         */
        new(): VersionController
    };