// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


import { egret } from '@egret-r/core';
const { HashObject } = egret;
import { ResourceConfig } from "../../assetsmanager/src/core/ResourceConfig";
import { compFunc } from "./AnimationAnalyzer";
import { ResourceItem } from "../../assetsmanager/src/shim/ResourceItem";

    /**
     * @classic
     * @private
     */
    export class AnalyzerBase extends HashObject{

        public constructor(){
            super();
            this.resourceConfig = <ResourceConfig>(RES["configInstance"]);
        }

        private resourceConfig:ResourceConfig = null;
        /**
         * 添加一个二级键名到配置列表。
         * @method RES.ResourceConfig#addSubkey
         * @param subkey {string} 要添加的二级键名
         * @param name {string} 二级键名所属的资源name属性
         */
        public addSubkey(subkey:string,name:string):void{
            this.resourceConfig.addSubkey(subkey,name);
        }
        /**
         * 加载一个资源文件
         * @param resItem 加载项信息
         * @param compFunc 加载完成回调函数,示例:compFunc(resItem:ResourceItem):void;
         * @param thisObject 加载完成回调函数的this引用
         */
        public loadFile(resItem:ResourceItem,compFunc:Function,thisObject:any):void{

        }
        /**
         * 同步方式获取解析完成的数据
         * @param name 对应配置文件里的name属性。
         */
        public getRes(name:string):any{

        }
        /**
         * 销毁某个资源文件的二进制数据,返回是否删除成功。
         * @param name 配置文件中加载项的name属性
         */
        public destroyRes(name:string):boolean{
            return false;
        }

        /**
         * 读取一个字符串里第一个点之前的内容。
         * @param name {string} 要读取的字符串
         */
        public static getStringPrefix(name:string):string{
            if(!name){
                return "";
            }
            let index:number = name.indexOf(".");
            if(index!=-1) {
                return name.substring(0, index);
            }
            return "";
        }
        /**
         * 读取一个字符串里第一个点之后的内容。
         * @param name {string} 要读取的字符串
         */
        public static getStringTail(name:string):string{
            if(!name){
                return "";
            }
            let index:number = name.indexOf(".");
            if(index!=-1) {
                return name.substring(index+1);
            }
            return "";
        }
    }