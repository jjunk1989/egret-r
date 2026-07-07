// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


import { egret } from '@egret-r/core';
const { Event, IOErrorEvent, HttpResponseType, HttpRequest } = egret;
import { IThemeAdapter } from "../../core/IThemeAdapter";

    /**
     * Default instance of interface <code>IThemeAdapter</code>.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 默认的IThemeAdapter接口实现。
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @language zh_CN
     */
    export class DefaultThemeAdapter implements IThemeAdapter {
        /**
         * 解析主题
         * @param url 待解析的主题url
         * @param compFunc 解析完成回调函数，示例：compFunc(e:Event):void;
         * @param errorFunc 解析失败回调函数，示例：errorFunc():void;
         * @param thisObject 回调的this引用
         */
        public getTheme(url:string,compFunc:Function,errorFunc:Function,thisObject:any):void {
            function onGet(event:Event):void {
                let loader:HttpRequest = <HttpRequest> (event.target);
                compFunc.call(thisObject, loader.response);
            }
            function onError(event:Event):void {
                errorFunc.call(thisObject);
            }
            let loader:HttpRequest = new HttpRequest();
            loader.addEventListener(egret.Event.COMPLETE,onGet,thisObject);
            loader.addEventListener(IOErrorEvent.IO_ERROR,onError,thisObject);
            loader.responseType = HttpResponseType.TEXT;
            loader.open(url);
            loader.send();
        }
    }