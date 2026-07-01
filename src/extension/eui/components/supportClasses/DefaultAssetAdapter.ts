// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { ImageLoader } from "../../../../egret/net/ImageLoader";
import { Event } from "../../../../egret/events/Event";
import { IOErrorEvent } from "../../../../egret/events/IOErrorEvent";
import { Texture } from "../../../../egret/display/Texture";
import { IAssetAdapter } from "../../core/IAssetAdapter";


    let loaderPool:ImageLoader[] = [];
    let callBackMap:any = {};
    let loaderMap:any = {};

    /**
     * Default instance of interface <code>IAssetAdapter</code>.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @includeExample extension/eui/components/supportClasses/DefaultAssetAdapterExample.ts
     * @language en_US
     */
    /**
     * 默认的IAssetAdapter接口实现。
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @includeExample extension/eui/components/supportClasses/DefaultAssetAdapterExample.ts
     * @language zh_CN
     */
    export class DefaultAssetAdapter implements IAssetAdapter {

        /**
         * resolve asset.
         * @param source the identifier of new asset need to be resolved
         * @param callBack callback function when resolving complete
         * example：callBack(content:any,source:string):void;
         * @param thisObject <code>this</code> object of callback method
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 解析素材
         * @param source 待解析的新素材标识符
         * @param callBack 解析完成回调函数，示例：callBack(content:any,source:string):void;
         * @param thisObject callBack的 this 引用
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public getAsset(source:string, callBack:(data:any, source:string) => void, thisObject:any):void {
            let list = callBackMap[source];
            if (list) {
                list.push([callBack, thisObject]);
                return;
            }
            let loader = loaderPool.pop();
            if (!loader) {
                loader = new ImageLoader();
            }
            callBackMap[source] = [[callBack, thisObject]];
            loaderMap[loader.$hashCode] = source;

            loader.addEventListener(Event.COMPLETE, this.onLoadFinish, this);
            loader.addEventListener(IOErrorEvent.IO_ERROR, this.onLoadFinish, this);
            loader.load(source);
        }

        /**
         * @private
         * 
         * @param event 
         */
        private onLoadFinish(event:Event):void {
            let loader = event.currentTarget;
            loader.removeEventListener(Event.COMPLETE, this.onLoadFinish, this);
            loader.removeEventListener(IOErrorEvent.IO_ERROR, this.onLoadFinish, this);
            let data:Texture;
            if (event.$type == Event.COMPLETE) {
                data = new Texture();
                data._setBitmapData(loader.data);
                loader.data = null;
            }
            loaderPool.push(loader);
            let source = loaderMap[loader.$hashCode];
            delete loaderMap[loader.$hashCode];
            let list:any[] = callBackMap[source];
            delete callBackMap[source];
            let length = list.length;
            for(let i=0;i<length;i++){
                let arr:any[] = list[i];
                arr[0].call(arr[1],data,source);
            }
        }
    }