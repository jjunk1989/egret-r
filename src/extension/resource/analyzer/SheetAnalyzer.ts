// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


import { egret } from '@egret-r/core';
const { HttpResponseType, SpriteSheet, Event, HttpRequest, IOErrorEvent, Texture, Rectangle, ImageLoader } = egret;
import { $warn } from "../../../Defines.debug";
import { BinAnalyzer } from "./BinAnalyzer";
import { ResourceItem } from "../../assetsmanager/src/shim/ResourceItem";
import { $getVirtualUrl } from "../Resource";

    /**
     * SpriteSheet解析器
     * @private
     */
    export class SheetAnalyzer extends BinAnalyzer {

        public constructor() {
            super();
            this._dataFormat = HttpResponseType.TEXT;
        }

        public getRes(name:string):any {
            let res:any = this.fileDic[name];
            if (!res) {
                res = this.textureMap[name];
            }
            if (!res) {
                let prefix:string = RES.AnalyzerBase.getStringPrefix(name);
                res = this.fileDic[prefix];
                if (res) {
                    let tail:string = RES.AnalyzerBase.getStringTail(name);
                    res = (<SpriteSheet> res).getTexture(tail);
                }
            }
            return res;
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
                    let texture:Texture = new Texture();
                    texture._setBitmapData(request.data);
                    this.analyzeBitmap(resItem, texture);
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

        private textureMap:any = {};

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
                imageUrl = this.getRelativePath(resItem.url, config["file"]);
            }
            return imageUrl;
        }

        /**
         * 解析并缓存加载成功的位图数据
         */
        public analyzeBitmap(resItem:ResourceItem, texture:Texture):void {
            let name:string = resItem.name;
            if (this.fileDic[name] || !texture) {
                return;
            }
            let config:any = this.sheetMap[name];
            delete this.sheetMap[name];
            let targetName:string = resItem.data && resItem.data.subkeys ? "" : name;
            let spriteSheet:SpriteSheet  = this.parseSpriteSheet(texture, config, targetName);
            this.fileDic[name] = spriteSheet;
        }

        /**
         * 获取相对位置
         */
        public getRelativePath(url:string, file:string):string {
            url = url.split("\\").join("/");

            let params = url.match(/#.*|\?.*/);
            let paramUrl = "";
            if (params) {
                paramUrl = params[0];
            }

            let index:number = url.lastIndexOf("/");
            if (index != -1) {
                url = url.substring(0, index + 1) + file;
            }
            else {
                url = file;
            }
            return url + paramUrl;
        }

        protected parseSpriteSheet(texture:Texture, data:any, name:string):SpriteSheet  {
            let frames:any = data.frames;
            if(!frames){
                return null;
            }
            let spriteSheet:SpriteSheet = new SpriteSheet(texture);
            let textureMap:any = this.textureMap;
            for(let subkey in frames){
                let config:any = frames[subkey];
                let texture:Texture = spriteSheet.createTexture(subkey,config.x,config.y,config.w,config.h,config.offX, config.offY,config.sourceW,config.sourceH);
                if(config["scale9grid"]){
                    let str:string = config["scale9grid"];
                    let list:string[] = str.split(",");
                    texture["scale9Grid"] = new Rectangle(parseInt(list[0]),parseInt(list[1]),parseInt(list[2]),parseInt(list[3]));
                }
                if(textureMap[subkey]==null){
                    textureMap[subkey] = texture;
                    if(name){
                        this.addSubkey(subkey,name);
                    }
                }
            }
            return spriteSheet;
        }

        public destroyRes(name:string):boolean {
            let sheet:any = this.fileDic[name];
            if (sheet) {
                delete this.fileDic[name];
                let texture;
                for (let subkey in sheet._textureMap) {
                    if (texture == null) {
                        texture = sheet._textureMap[subkey];
                        this.onResourceDestroy(texture);
                        texture = null;
                    }
                    delete this.textureMap[subkey];
                }
                if(sheet.dispose) {
                    sheet.dispose();
                }
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

        protected onResourceDestroy(texture:any) {
            if (texture) {
                texture.dispose();
            }
        }
    }
