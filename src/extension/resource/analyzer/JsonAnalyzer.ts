// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { HttpResponseType } from "../../../egret/net/HttpResponseType";
import { BinAnalyzer } from "./BinAnalyzer";
import { ResourceItem } from "../../assetsmanager/src/shim/ResourceItem";
import { $warn } from "";


    /**
     * @private
     */
    export class JsonAnalyzer extends BinAnalyzer {

        public constructor() {
            super();
            this._dataFormat = HttpResponseType.TEXT;
        }

        /**
         * 解析并缓存加载成功的数据
         */
        public analyzeData(resItem:ResourceItem, data:any):void {
            let name:string = resItem.name;
            if (this.fileDic[name] || !data) {
                return;
            }
            try {
                let str:string = <string> data;
                this.fileDic[name] = JSON.parse(str);
            }
            catch (e) {
                $warn(1017, resItem.url, data);
            }
        }
    }