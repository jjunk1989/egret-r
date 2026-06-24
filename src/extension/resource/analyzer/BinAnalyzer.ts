// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


namespace RES {
    /**
     * @private
     */
    export class BinAnalyzer extends AnalyzerBase {
        /**
         * 构造函数
         */
        public constructor() {
            super();
        }

        /**
         * 字节流数据缓存字典
         */
        public fileDic:any = {};
        /**
         * 加载项字典
         */
        public resItemDic:any[] = [];

        /**
         * @inheritDoc
         */
        public loadFile(resItem:ResourceItem, compFunc:Function, thisObject:any):void {
            if (this.fileDic[resItem.name]) {
                compFunc.call(thisObject, resItem);
                return;
            }
            let request:egret.HttpRequest = this.getRequest();
            this.resItemDic[request.hashCode] = {item: resItem, func: compFunc, thisObject: thisObject};


            request.open($getVirtualUrl(resItem.url));
            request.send();
        }

        public _dataFormat:string = egret.HttpResponseType.ARRAY_BUFFER;

        /**
         * Loader对象池
         */
        protected recycler:egret.HttpRequest[] = [];
        /**
         * 获取一个URLLoader对象
         */
        private getRequest():egret.HttpRequest {
            let request:egret.HttpRequest = this.recycler.pop();
            if (!request) {
                request = new egret.HttpRequest();
                request.addEventListener(egret.Event.COMPLETE, this.onLoadFinish, this);
                request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadFinish, this);
            }
            request.responseType = this._dataFormat;
            return request;
        }

        /**
         * 一项加载结束
         */
        public onLoadFinish(event:egret.Event):void {
            let request:egret.HttpRequest = <egret.HttpRequest> (event.target);
            let data:any = this.resItemDic[request.hashCode];
            delete this.resItemDic[request.hashCode];
            let resItem:ResourceItem = data.item;
            let compFunc:Function = data.func;
            resItem.loaded = (event.type == egret.Event.COMPLETE);
            if (resItem.loaded) {
                this.analyzeData(resItem, request.response)
            }
            this.recycler.push(request);
            compFunc.call(data.thisObject, resItem);
        }

        /**
         * 解析并缓存加载成功的数据
         */
        public analyzeData(resItem:ResourceItem, data:any):void {
            let name:string = resItem.name;
            if (this.fileDic[name] || (data != "" && !data)) {
                return;
            }
            this.fileDic[name] = data;
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

        protected onResourceDestroy(resource:any) {
        }
    }
}