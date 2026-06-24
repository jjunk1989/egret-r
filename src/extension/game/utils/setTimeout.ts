// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret {

    let setTimeoutCache: any = {};
    let setTimeoutIndex: number = 0;

    let setTimeoutCount: number = 0;
    let lastTime: number = 0;
    /**
     * Run the designated function in specified delay (in milliseconds).
     * @param listener {Function} Listener function
     * @param thisObject {any} this object
     * @param delay {number} Delay time, in milliseconds
     * @param ...args {any} Parameter list
	 * @returns {number} Return index which can be used for clearTimeout
     * @version Egret 2.4
     * @platform Web
     * @includeExample extension/game/utils/setTimeout.ts
     * @language en_US
     */
    /**
     * 在指定的延迟（以毫秒为单位）后运行指定的函数。
     * @param listener {Function} 侦听函数
     * @param thisObject {any} this对象
     * @param delay {number} 延迟时间，以毫秒为单位
     * @param ...args {any} 参数列表
	 * @returns {number} 返回索引，可以用于 clearTimeout
     * @version Egret 2.4
     * @platform Web
     * @includeExample extension/game/utils/setTimeout.ts
     * @language zh_CN
     */
    export function setTimeout<Z>(listener: (this: Z, ...arg) => void, thisObject: Z, delay: number, ...args): number {
        let data = { listener, thisObject, delay: delay, params: args };

        setTimeoutCount++;
        if (setTimeoutCount == 1 && egret.ticker) {
            lastTime = egret.getTimer();
            egret.ticker.$startTick(timeoutUpdate, null);
        }

        setTimeoutIndex++;
        setTimeoutCache[setTimeoutIndex] = data;
        return setTimeoutIndex;
    }

    /**
     * Function run after the specified delay is cleared.
     * @param key {number} Index that egret.setTimeout returns
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * 清除指定延迟后运行的函数。
     * @param key {number} egret.setTimeout所返回的索引
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
    export function clearTimeout(key: number): void {
        if (setTimeoutCache[key]) {
            setTimeoutCount--;
            delete setTimeoutCache[key];

            if (setTimeoutCount == 0 && egret.ticker) {
                egret.ticker.$stopTick(timeoutUpdate, null);
            }
        }

    }

    /**
     * @private
     * 
     * @param dt 
     */
    function timeoutUpdate(timeStamp: number): boolean {
        let dt: number = timeStamp - lastTime;
        lastTime = timeStamp;

        for (let key in setTimeoutCache) {
            let key2: any = key;
            let data = setTimeoutCache[key2];
            data.delay -= dt;
            if (data.delay <= 0) {
                clearTimeout(<number>key2);
                data.listener.apply(data.thisObject, data.params);
            }
        }

        return false;
    }
}
