// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


import { egret } from '@egret-r/core';
const { HttpResponseType, Event, HttpRequest, IOErrorEvent, ImageLoader, BitmapData, Texture } = egret;
import { BinAnalyzer } from "./BinAnalyzer";
import { ResourceItem } from "../core/ResourceItem";
import { $warn } from "../../../Defines.debug";

    /**
     * SpriteSheet解析器
     * @private
     */
    export class AnimationAnalyzer extends BinAnalyzer {

        public constructor() {
            super();
            this._dataFormat = HttpResponseType.TEXT;
        }

        /**
         * 一项加载结束
         */
        public onLoadFinish(event:Event):void {
            let request = event.target;
            let data:any = this.resItemDic[request.$hashCode];
            delete this.resItemDic[request.hashCode];
            let resItem:ResourceItem = data.item;
            let compFunc:Function = data.func;
            resItem.loaded = (event.type == Event.COMPLETE);
            if (resItem.loaded) {
                if (request instanceof HttpRequest) {
                    resItem.loaded = false;
                    let imageUrl:string = this.analyzeConfig(resItem, request.response);
                    if (imageUrl) {
                        this.loadImage(imageUrl, data);
                        this.recycler.push(request);
                        return;
                    }
                }
                else {
                    this.analyzeBitmap(resItem, (<ImageLoader>request).data);
                }
            }
            if (request instanceof HttpRequest) {
                this.recycler.push(request);
            }
            else {
                this.recyclerIamge.push(request);
            }
            compFunc.call(data.thisObject, resItem);
        }

        public sheetMap:any = {};

        /**
         * 解析并缓存加载成功的配置文件
         */
        public analyzeConfig(resItem:ResourceItem, data:string):string {
            let name:string = resItem.name;
            let config:any;
            let imageUrl:string = "";
            try {
                let str:string = <string> data;
                config = JSON.parse(str);
            }
            catch (e) {
                $warn(1017, resItem.url, data);
            }
            if (config) {
                this.sheetMap[name] = config;
                if (config["file"]) {
                    imageUrl = this.getRelativePath(resItem.url, config["file"]);
                }
                else {
                    let arr = resItem.url.split("?");
                    let arr2 = arr[0].split("/");
                    arr2[arr2.length - 1] = arr2[arr2.length - 1].split(".")[0] + ".png";
                    imageUrl = "";
                    for (let i = 0; i < arr2.length; i++) {
                        imageUrl += arr2[i] + (i < arr2.length - 1 ? "/" : "");
                    }
                    if (arr.length == 2) imageUrl += arr[2];
                }
            }
            return imageUrl;
        }

        /**
         * 解析并缓存加载成功的位图数据
         */
        public analyzeBitmap(resItem:ResourceItem, data:BitmapData):void {
            let name:string = resItem.name;
            if (this.fileDic[name] || !data) {
                return;
            }
            let config:any = this.sheetMap[name];
            delete this.sheetMap[name];
            let targetName:string = resItem.data && resItem.data.subkeys ? "" : name;
            let spriteSheet:any = this.parseAnimation(data, config, targetName);
            this.fileDic[name] = spriteSheet;
        }

        /**
         * 获取相对位置
         */
        public getRelativePath(url:string, file:string):string {
            url = url.split("\\").join("/");
            let index:number = url.lastIndexOf("/");
            if (index != -1) {
                url = url.substring(0, index + 1) + file;
            }
            else {
                url = file;
            }
            return url;
        }

        private parseAnimation(bitmapData:BitmapData, data:any, name:string):Texture[] {
            let attributes = Object.keys(data.mc);
            let list:any[] = data.mc[attributes[0]].frames;
            let len = list.length;
            let config;
            let animationFrames:Texture[] = [];
            for (let i = 0; i < len; i++) {
                config = data.res[list[i].res];
                let texture = new Texture();
                texture.$bitmapData = bitmapData;
                texture.$initData(config.x, config.y, config.w, config.h, list[i].x, list[i].y, list[i].sourceW, list[i].sourceH, bitmapData.width, bitmapData.height);
            }
            return animationFrames;
        }

        public destroyRes(name:string):boolean {
            let sheet:any = this.fileDic[name];
            if (sheet) {
                delete this.fileDic[name];
                return true;
            }
            return false;
        }

        /**
         * ImageLoader对象池
         */
        private recyclerIamge:ImageLoader[] = [];

        private loadImage(url:string, data:any):void {
            let loader = this.getImageLoader();
            this.resItemDic[loader.hashCode] = data;
            loader.load($getVirtualUrl(url));
        }

        private getImageLoader():ImageLoader {
            let loader = this.recyclerIamge.pop();
            if (!loader) {
                loader = new ImageLoader();
                loader.addEventListener(Event.COMPLETE, this.onLoadFinish, this);
                loader.addEventListener(IOErrorEvent.IO_ERROR, this.onLoadFinish, this);
            }
            return loader;
        }
    }
