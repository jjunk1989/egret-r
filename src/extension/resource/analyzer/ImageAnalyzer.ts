// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


import { egret } from '@egret-r/core';
const { ImageLoader, Event, IOErrorEvent, Texture, Rectangle } = egret;
import { AnalyzerBase } from "./AnalyzerBase";
import { ResourceItem } from "../core/ResourceItem";
import { $getVirtualUrl } from "../Resource";

    /**
     * @private
     */
    export class ImageAnalyzer extends AnalyzerBase {

        /**
         * 构造函数
         */
        public constructor() {
            super();
        }

        /**
         * 字节流数据缓存字典
         */
        protected fileDic:any = {};
        /**
         * 加载项字典
         */
        protected resItemDic:any[] = [];

        /**
         * @inheritDoc
         */
        public loadFile(resItem:ResourceItem, compFunc:Function, thisObject:any):void {
            if (this.fileDic[resItem.name]) {
                compFunc.call(thisObject, resItem);
                return;
            }
            let loader = this.getLoader();
            this.resItemDic[loader.$hashCode] = {item: resItem, func: compFunc, thisObject: thisObject};
            loader.load($getVirtualUrl(resItem.url));
        }

        /**
         * Loader对象池
         */
        protected recycler:ImageLoader[] = [];

        /**
         * 获取一个Loader对象
         */
        private getLoader():ImageLoader {
            let loader = this.recycler.pop();
            if (!loader) {
                loader = new ImageLoader();
                loader.addEventListener(Event.COMPLETE, this.onLoadFinish, this);
                loader.addEventListener(IOErrorEvent.IO_ERROR, this.onLoadFinish, this);
            }
            return loader;
        }

        /**
         * 一项加载结束
         */
        protected onLoadFinish(event:Event):void {
            let request = <ImageLoader> (event.$target);
            let data:any = this.resItemDic[request.$hashCode];
            delete this.resItemDic[request.$hashCode];
            let resItem:ResourceItem = data.item;
            let compFunc:Function = data.func;
            resItem.loaded = (event.$type == Event.COMPLETE);
            if (resItem.loaded) {
                let texture:Texture = new Texture();
                texture._setBitmapData(request.data);

                this.analyzeData(resItem, texture)
            }
            this.recycler.push(request);
            compFunc.call(data.thisObject, resItem);
        }

        /**
         * 解析并缓存加载成功的数据
         */
        protected analyzeData(resItem:ResourceItem, texture:Texture):void {
            let name:string = resItem.name;
            if (this.fileDic[name] || !texture) {
                return;
            }

            this.fileDic[name] = texture;
            let config:any = resItem.data;
            if (config && config["scale9grid"]) {
                let str:string = config["scale9grid"];
                let list:string[] = str.split(",");
                texture["scale9Grid"] = new Rectangle(parseInt(list[0]), parseInt(list[1]), parseInt(list[2]), parseInt(list[3]));
            }
        }

        /**
         * @inheritDoc
         */
        public getRes(name:string):any {
            return this.fileDic[name];
        }

        /**
         * @inheritDoc
         */
        public hasRes(name:string):boolean {
            let res:any = this.getRes(name);
            return res != null;
        }

        /**
         * @inheritDoc
         */
        public destroyRes(name:string):boolean {
            if (this.fileDic[name]) {
                this.onResourceDestroy(this.fileDic[name]);
                delete this.fileDic[name];
                return true;
            }
            return false;
        }

        protected onResourceDestroy(texture:any) {
            texture.dispose();
        }
    }