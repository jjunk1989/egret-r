// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


import { egret } from '@egret-r/core';
const { Sound, Event, IOErrorEvent } = egret;
import { AnalyzerBase } from "./AnalyzerBase";
import { ResourceItem } from "../core/ResourceItem";
import { $getVirtualUrl } from "../Resource";

    /**
     * @private
     */
    export class SoundAnalyzer extends AnalyzerBase {

        /**
         * 构造函数
         */
        public constructor() {
            super();
        }

        /**
         * 字节流数据缓存字典
         */
        protected soundDic:any = {};
        /**
         * 加载项字典
         */
        protected resItemDic:any[] = [];

        /**
         * @inheritDoc
         */
        public loadFile(resItem:ResourceItem, callBack:Function, thisObject:any):void {
            if (this.soundDic[resItem.name]) {
                callBack.call(thisObject, resItem);
                return;
            }
            let sound = new Sound();
            sound.addEventListener(egret.Event.COMPLETE, this.onLoadFinish, this);
            sound.addEventListener(IOErrorEvent.IO_ERROR, this.onLoadFinish, this);
            this.resItemDic[sound.$hashCode] = {item: resItem, func: callBack, thisObject: thisObject};
            sound.load($getVirtualUrl(resItem.url));
            if (resItem.data) {
                sound.type = resItem.data.soundType;
            }
        }

        /**
         * 一项加载结束
         */
        protected onLoadFinish(event:Event):void {
            let sound = <Sound> (event.$target);
            sound.removeEventListener(egret.Event.COMPLETE, this.onLoadFinish, this);
            sound.removeEventListener(IOErrorEvent.IO_ERROR, this.onLoadFinish, this);
            let data:any = this.resItemDic[sound.$hashCode];
            delete this.resItemDic[sound.$hashCode];
            let resItem:ResourceItem = data.item;
            let compFunc:Function = data.func;
            resItem.loaded = (event.$type == egret.Event.COMPLETE);
            if (resItem.loaded) {
                this.analyzeData(resItem, sound)
            }
            compFunc.call(data.thisObject, resItem);
        }

        /**
         * 解析并缓存加载成功的数据
         */
        protected analyzeData(resItem:ResourceItem, data:Sound):void {
            let name:string = resItem.name;
            if (this.soundDic[name] || !data) {
                return;
            }
            this.soundDic[name] = data;
        }

        /**
         * @inheritDoc
         */
        public getRes(name:string):any {
            return this.soundDic[name];
        }

        /**
         * @inheritDoc
         */
        public hasRes(name:string):boolean {
            return !!this.getRes(name);
        }

        /**
         * @inheritDoc
         */
        public destroyRes(name:string):boolean {
            if (this.soundDic[name]) {
                delete this.soundDic[name];
                return true;
            }
            return false;
        }
    }