// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


import { egret } from '@egret-r/core';
const { Event, IOErrorEvent, EventDispatcher, Sound, ProgressEvent, HttpResponseType, ImageLoader, Texture, HttpRequest, HttpMethod } = egret;
import { URLLoaderDataFormat } from "./URLLoaderDataFormat";
import { URLRequestHeader } from "./URLRequestHeader";

import { URLRequest } from "./URLRequest";
import { URLVariables } from "./URLVariables";

import { URLRequestMethod } from "./URLRequestMethod";

    function $getUrl(request: URLRequest): string {
        let url: string = request.url;
        //get请求没有设置参数，而是设置URLVariables的情况
        if (url.indexOf("?") == -1 && request.method == URLRequestMethod.GET && request.data && request.data instanceof URLVariables) {
            url = url + "?" + request.data.toString();
        }
        return url;
    }

	/**
     * UThe URLLoader class downloads data from a URL as text, binary data, or URL-encoded variables.  It is useful for downloading text files, XML, or other information to be used in a dynamic, data-driven application.
     * A URLLoader object downloads all of the data from a URL before making it available to code in the applications. It sends out notifications about the progress of the download,
     * which you can monitor through bytesLoaded and bytesTotal properties, as well as through dispatched events.
     * @see http://edn.egret.com/cn/docs/page/601 Build communication request
     * @event egret.Event.COMPLETE Dispatched when the net request is complete.
     * @event IOErrorEvent.IO_ERROR io error. 
     * @version Egret 2.4
     * @platform Web
     * @includeExample extension/game/net/URLLoader.ts
     * @language en_US
	 */
	/**
     * URLLoader 类以文本、二进制数据或 URL 编码变量的形式从 URL 下载数据。在下载文本文件、XML 或其他用于动态数据驱动应用程序的信息时，它很有用。
     * URLLoader 对象会先从 URL 中下载所有数据，然后才将数据用于应用程序中的代码。它会发出有关下载进度的通知，
     * 通过 bytesLoaded 和 bytesTotal 属性以及已调度的事件，可以监视下载进度。
     * @see http://edn.egret.com/cn/docs/page/601 构建通信请求
     * @event egret.Event.COMPLETE 加载完成后调度。 
     * @event IOErrorEvent.IO_ERROR 加载错误后调度。 
     * @version Egret 2.4
     * @platform Web
     * @includeExample extension/game/net/URLLoader.ts
     * @language zh_CN
	 */
    export class URLLoader extends EventDispatcher {

		/**
         * Create an egret.URLLoader object
		 * @param request {URLRequest} A URLRequest object specifies the URL to be downloaded.
         * If this parameter is omitted, no load operation begins. If a parameter is specified, the load operation begins immediately
         * @version Egret 2.4
         * @platform Web
         * @language en_US
		 */
		/**
         * 创建 egret.URLLoader 对象
		 * @param request {URLRequest} 一个 URLRequest 对象，指定要下载的 URL。
         * 如果省略该参数，则不开始加载操作。如果已指定参数，则立即开始加载操作
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
		 */
        public constructor(request: URLRequest = null) {
            super();
            if (request) {
                this.load(request);
            }
        }

		/**
         * Control whether the downloaded data is received as text (URLLoaderDataFormat.TEXT), raw binary data (URLLoaderDataFormat.BINARY), or URL-encoded variables (URLLoaderDataFormat.VARIABLES).
         * If the value of the dataFormat property is URLLoaderDataFormat.TEXT, the received data is a string containing the text of the loaded file.
         * If the value of the dataFormat property is URLLoaderDataFormat.BINARY, the received data is a ByteArray object containing the raw binary data.
         * If the value of the dataFormat property is URLLoaderDataFormat.TEXTURE, the received data is a Texture object containing the bitmap data.
         * If the value of the dataFormat property is URLLoaderDataFormat.VARIABLES, the received data is a URLVariables object containing the URL-encoded variables.
         * The default value is URLLoaderDataFormat.TEXT.
         * @default URLLoaderDataFormat.TEXT
         * @version Egret 2.4
         * @platform Web
         * @language en_US
		 */
        /**
         * 控制是以文本 (URLLoaderDataFormat.TEXT)、原始二进制数据 (URLLoaderDataFormat.BINARY) 还是 URL 编码变量 (URLLoaderDataFormat.VARIABLES) 接收下载的数据。
         * 如果 dataFormat 属性的值是 URLLoaderDataFormat.TEXT，则所接收的数据是一个包含已加载文件文本的字符串。
         * 如果 dataFormat 属性的值是 URLLoaderDataFormat.BINARY，则所接收的数据是一个包含原始二进制数据的 ByteArray 对象。
         * 如果 dataFormat 属性的值是 URLLoaderDataFormat.TEXTURE，则所接收的数据是一个包含位图数据的Texture对象。
         * 如果 dataFormat 属性的值是 URLLoaderDataFormat.VARIABLES，则所接收的数据是一个包含 URL 编码变量的 URLVariables 对象。
         * @default URLLoaderDataFormat.TEXT
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public dataFormat: string = URLLoaderDataFormat.TEXT;

		/**
         * The data received from the load operation. This property is populated only when the load operation is complete. The format of the data depends on the setting of the dataFormat property:
         * If the dataFormat property is URLLoaderDataFormat.TEXT, the received data is a string containing the text of the loaded file.
         * If the dataFormat property is URLLoaderDataFormat.BINARY, the received data is a ByteArray object containing the raw binary data.
         * If the dataFormat property is URLLoaderDataFormat.TEXTURE, the received data is a Texture object containing the bitmap data.
         * If the dataFormat property is URLLoaderDataFormat.VARIABLES, the received data is a URLVariables object containing the URL-encoded variables.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
		 */
		/**
         * 从加载操作接收的数据。只有完成加载操作时，才会填充该属性。该数据的格式取决于 dataFormat 属性的设置：
         * 如果 dataFormat 属性是 URLLoaderDataFormat.TEXT，则所接收的数据是一个包含已加载文件文本的字符串。
         * 如果 dataFormat 属性是 URLLoaderDataFormat.BINARY，则所接收的数据是一个包含原始二进制数据的 ByteArray 对象。
         * 如果 dataFormat 属性是 URLLoaderDataFormat.TEXTURE，则所接收的数据是一个包含位图数据的Texture对象。
         * 如果 dataFormat 属性是 URLLoaderDataFormat.VARIABLES，则所接收的数据是一个包含 URL 编码变量的 URLVariables 对象。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
		 */
        public data: any = null;

        /**
         * @private
         */
        public _request: URLRequest = null;

		/**
         * Send and load data from the specified URL. The data can be received as text, raw binary data, or URL-encoded variables, depending on the value you set for the dataFormat property.
         * Note that the default value of the dataFormat property is text. If you want to send data to the specified URL, you can set the data property in the URLRequest object.
         * @param request {URLRequest}  A URLRequest object specifies the URL to be downloaded.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
		/**
         * 从指定的 URL 发送和加载数据。可以以文本、原始二进制数据或 URL 编码变量格式接收数据，这取决于为 dataFormat 属性所设置的值。
         * 请注意 dataFormat 属性的默认值为文本。如果想将数据发送至指定的 URL，则可以在 URLRequest 对象中设置 data 属性。
		 * @param request {URLRequest}  一个 URLRequest 对象，指定要下载的 URL。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public load(request: URLRequest): void {
            this._request = request;
            this.data = null;
            let loader = this;
            if (loader.dataFormat == URLLoaderDataFormat.TEXTURE) {
                this.loadTexture(loader);
                return;
            }
            if (loader.dataFormat == URLLoaderDataFormat.SOUND) {
                this.loadSound(loader);
                return;
            }

            let virtualUrl: string = $getUrl(request);
            let httpRequest = new HttpRequest();
            httpRequest.open(virtualUrl, request.method == URLRequestMethod.POST ? HttpMethod.POST : HttpMethod.GET);
            let sendData;
            if (request.method == URLRequestMethod.GET || !request.data) {
            }
            else if (request.data instanceof URLVariables) {
                httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                let urlVars: URLVariables = <URLVariables>request.data;
                sendData = urlVars.toString();
            }
            else {
                httpRequest.setRequestHeader("Content-Type", "multipart/form-data");
                sendData = request.data;
            }
            let length = request.requestHeaders.length;
            for (let i: number = 0; i < length; i++) {
                let urlRequestHeader: URLRequestHeader = request.requestHeaders[i];
                httpRequest.setRequestHeader(urlRequestHeader.name, urlRequestHeader.value);
            }
            httpRequest.addEventListener(Event.COMPLETE, function () {
                loader.data = httpRequest.response;
                Event.dispatchEvent(loader, Event.COMPLETE);
            }, this);
            httpRequest.addEventListener(IOErrorEvent.IO_ERROR, function () {
                IOErrorEvent.dispatchIOErrorEvent(loader);
            }, this);
            httpRequest.responseType = loader.dataFormat == URLLoaderDataFormat.BINARY ? HttpResponseType.ARRAY_BUFFER : HttpResponseType.TEXT;
            httpRequest.send(sendData);
        }

        private getResponseType(dataFormat: string): string {
            switch (dataFormat) {
                case URLLoaderDataFormat.TEXT:
                case URLLoaderDataFormat.VARIABLES:
                    return URLLoaderDataFormat.TEXT;
                case URLLoaderDataFormat.BINARY:
                    return "arraybuffer";

                default:
                    return dataFormat;
            }
        }
        /**
         * @private
         */
        private sound: Sound;
        /**
         * @private
         *
         * @param loader
         */
        private loadSound(loader: URLLoader): void {
            let self = this;
            let virtualUrl: string = loader._request.url;

            let sound: Sound = new Sound();
            this.sound = sound;
            sound.addEventListener(Event.COMPLETE, this.onSoundoadComplete, this);
            sound.addEventListener(IOErrorEvent.IO_ERROR, this.onSoundLoaderError, this);
            sound.addEventListener(ProgressEvent.PROGRESS, this.onSoundLoaderPostProgress, this);
            sound.load(virtualUrl);
        }
        private onSoundoadComplete(event): void {
            this.removeSoundLoaderListeners();
            this.data = this.sound;
            window.setTimeout(()=> {
                this.dispatchEventWith(Event.COMPLETE);
            }, 0);
        }
        private onSoundLoaderPostProgress(event: ProgressEvent): void {
            this.dispatchEvent(event);
        }
        private onSoundLoaderError(event: ProgressEvent): void {
            this.dispatchEvent(event);
        }
        private removeSoundLoaderListeners(): void {
            this.sound.removeEventListener(Event.COMPLETE, this.onSoundoadComplete, this);
            this.sound.removeEventListener(IOErrorEvent.IO_ERROR, this.onSoundLoaderError, this);
            this.sound.removeEventListener(ProgressEvent.PROGRESS, this.onSoundLoaderPostProgress, this);
        }
        /**
         * @private
         */
        private imageLoader: ImageLoader;
        /**
         * @private
         */
        private virtualUrl: string;
        /**
         * @private
         *
         * @param loader
         */
        private loadTexture(loader: URLLoader): void {
            this.virtualUrl = loader._request.url;
            let imageLoader: ImageLoader = new ImageLoader();
            this.imageLoader = imageLoader;
            imageLoader.addEventListener(Event.COMPLETE, this.onImageLoadComplete, this);
            imageLoader.addEventListener(IOErrorEvent.IO_ERROR, this.onImageLoaderError, this);
            imageLoader.addEventListener(ProgressEvent.PROGRESS, this.onImageLoaderPostProgress, this);
            imageLoader.load(this.virtualUrl);
        }
        private onImageLoadComplete(event): void {
            this.removeImageLoaderListeners();
            let texture: Texture = new Texture();
            let bitmapData = this.imageLoader.data;
            if (bitmapData.source.setAttribute) {
                bitmapData.source.setAttribute("bitmapSrc", this.virtualUrl);
            }
            texture._setBitmapData(bitmapData);
            this.data = texture;
            window.setTimeout(()=> {
                this.dispatchEventWith(Event.COMPLETE);
            }, 0);
        }
        private onImageLoaderPostProgress(event: ProgressEvent): void {
            this.dispatchEvent(event);
        }
        private onImageLoaderError(event: ProgressEvent): void {
            this.dispatchEvent(event);
        }
        private removeImageLoaderListeners(): void {
            this.imageLoader.removeEventListener(Event.COMPLETE, this.onImageLoadComplete, this);
            this.imageLoader.removeEventListener(IOErrorEvent.IO_ERROR, this.onImageLoaderError, this);
            this.imageLoader.removeEventListener(ProgressEvent.PROGRESS, this.onImageLoaderPostProgress, this);
        }

        /**
         * @private
         */
        public _status: number = -1;

        /**
         * @private
         * 
         */
        public __recycle(): void {
            this._request = null;
            this.data = null;
        }

    }
