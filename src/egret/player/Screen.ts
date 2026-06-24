// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret.sys {
    /**
     * @private
     * 设备屏幕
     */
    export interface Screen {
        /**
         * @private
         * 更新屏幕视口尺寸
         */
        updateScreenSize();

        /**
         * @private
         * 更新触摸数量
         */
        updateMaxTouches();

        /**
         * @private
         * 设置分辨率尺寸
         */
        setContentSize(width:number, height:number);
    }
}