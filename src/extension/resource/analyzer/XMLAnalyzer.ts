// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


import { egret } from '@egret-r/core';
const { HttpResponseType, XML } = egret;
import { BinAnalyzer } from "./BinAnalyzer";
import { ResourceItem } from "../../assetsmanager/src/shim/ResourceItem";

    /**
     * @private
     */
    export class XMLAnalyzer extends BinAnalyzer{

        public constructor(){
            super();
            this._dataFormat = HttpResponseType.TEXT;
        }

        /**
         * 解析并缓存加载成功的数据
         */
        public analyzeData(resItem:ResourceItem,data:any):void{
            let name:string = resItem.name;
            if(this.fileDic[name]||!data){
                return;
            }
            try{
                let xmlStr:string = <string> data;
                let xml:any = XML.parse(xmlStr);
                this.fileDic[name] = xml;
            }
            catch (e){
            }
        }
    }