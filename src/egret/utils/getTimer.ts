// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


namespace egret {

    /**
     * Used to compute relative time.this method returns the number of milliseconds since the Egret framework was initialized
     * @returns The number of milliseconds since the Egret framework was initialized
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/utils/getTimer.ts
     * @language en_US
     */
    /**
     * 用于计算相对时间。此方法返回自启动 Egret 框架以来经过的毫秒数。
     * @returns 启动 Egret 框架以来经过的毫秒数。
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/utils/getTimer.ts
     * @language zh_CN
     */
    export function getTimer():number {
        return Date.now() - sys.$START_TIME;
    }
}