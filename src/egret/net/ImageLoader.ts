// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { Event } from "../events/Event";
import { IOErrorEvent, HttpRequest } from "../events/IOErrorEvent";
import { EventDispatcher } from "../events/EventDispatcher";
import { BitmapData } from "../display/BitmapData";


    /**
     * The Loader class is used to load image (JPG, PNG, or GIF) files. Use the load() method to initiate loading.
     * The loaded image data is in the data property of ImageLoader.
     * @event egret.Event.COMPLETE Dispatched when the net request is complete.
     * @event IOErrorEvent.IO_ERROR Dispatched when the net request is failed.
     * @see HttpRequest
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/net/ImageLoaderExample.ts
     * @see http://edn.egret.com/cn/docs/page/590 加载位图文件
     * @language en_US
     */
    /**
     * ImageLoader 类可用于加载图像（JPG、PNG 或 GIF）文件。使用 load() 方法来启动加载。被加载的图像对象数据将存储在 ImageLoader.data 属性上 。
     * @event egret.Event.COMPLETE 加载完成
     * @event IOErrorEvent.IO_ERROR 加载失败
     * @see HttpRequest
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/net/ImageLoaderExample.ts
     * @see http://edn.egret.com/cn/docs/page/590 加载位图文件
     * @language zh_CN
     */
    export interface ImageLoader extends EventDispatcher {
        /**
         * The data received from the load operation.
         * @default null
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 使用 load() 方法加载成功的 BitmapData 图像数据。
         * @default null
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        data:BitmapData;
        /**
         * Specifies whether or not cross-site Access-Control requests should be made when loading a image from foreign origins.<br/>
         * possible values are:"anonymous","use-credentials" or null.
         * @default null
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 当从其他站点加载一个图片时，指定是否启用跨域资源共享(CORS)，默认值为null。<br/>
         * 可以设置为"anonymous","use-credentials"或null,设置为其他值将等同于"anonymous"。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        crossOrigin:string;
        /**
         * start a load operation。<br/>
         * Note: Calling this method for an already active request (one for which load() has already been
         * called) will abort the last load operation immediately.
         * @param url 要加载的图像文件的地址。
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 启动一次图像加载。<br/>
         * 注意：若之前已经调用过加载请求，重新调用 load() 将终止先前的请求，并开始新的加载。
         * @param url 要加载的图像文件的地址。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        load(url:string):void;

    }

    /**
     * Creates a ImageLoader object
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * 创建一个 ImageLoader 实例
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
        export function setImageLoader(cls: typeof ImageLoader) { ImageLoader = cls; }
export let ImageLoader:{
        /**
         * constructor
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 构造函数
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        new():ImageLoader;

        /**
         * Specifies whether to enable cross-origin resource sharing, If ImageLoader instance has been set crossOrigin property will be used to set the property.
         * @version Egret 2.5.7
         * @platform Web
         * @language en_US
         */
        /**
         * 指定是否启用跨域资源共享,如果ImageLoader实例有设置过crossOrigin属性将使用设置的属性
         * @version Egret 2.5.7
         * @platform Web
         * @language zh_CN
         */
        crossOrigin:string;
    };