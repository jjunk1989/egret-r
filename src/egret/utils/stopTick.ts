// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { startTick } from "./startTick";
import { $error } from "../../Defines.debug";
import { DEBUG } from "../../Defines.debug";
import { ticker } from "../player/SystemTicker";


    /**
     * Stops the timer started by the startTick() method.
     * @param callBack the call back method. the timeStamp parameter of this method represents the number of milliseconds
     * since the Egret framework was initialized. If the return value of this method is true, it will force Egret runtime
     * to render after processing of this method completes.
     * @param thisObject the call back method's "this"
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * 停止之前用 startTick() 方法启动的计时器。
     * @param callBack 要执行的回调方法。参数 timeStamp 表示从启动Egret框架开始经过的时间(毫秒)。
     * 若回调方法返回值为true，其作用与TimerEvent.updateAfterEvent()类似，将会忽略帧频限制，在此方法处理完成后立即重绘屏幕。
     * @param thisObject 回调方法的this对象引用。
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
    export function stopTick(callBack:(timeStamp:number)=>boolean,thisObject:any):void{
        if (DEBUG && !callBack) {
            $error(1003, "callBack");
        }
        ticker.$stopTick(callBack,thisObject);
    }