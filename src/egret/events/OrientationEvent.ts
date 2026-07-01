// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { Event } from "./Event";

    /**
     * The OrientationEvent provides information from the physical orientation of the device.
     * Note: Currently, Browsers on the iOS and Android does not handle the coordinates the same way.
     * Take care about this while using them.
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/sensor/DeviceOrientation.ts
     * @language en_US
     */
    /**
     * OrientationEvent 提供设备的方向信息
     * 注意: 目前各个浏览器和操作系统处理方向的方式不完全相同，请根据使用场景做相应的校正，
     * 比如使用两次方向数据的变化而不是直接使用方向的值
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/sensor/DeviceOrientation.ts
     * @language zh_CN
     */
    export class OrientationEvent extends Event {
        /**
         * A number representing the motion of the device around the z axis,
         * express in degrees with values ranging from 0 to 360
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 表示设备绕 Z 轴的角度，单位是 角度 范围是 0 到 360
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public alpha: number;
        /**
         * A number representing the motion of the device around the x axis,
         * express in degrees with values ranging from -180 to 180.
         * This represents a front to back motion of the device.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 表示设备绕 X 轴的角度，单位是 角度 范围是 -180 到 180.
         * 这个值表示设备从前向后的旋转状态
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public beta: number;
        /**
         * A number representing the motion of the device around the y axis,
         * express in degrees with values ranging from -90 to 90.
         * This represents a left to right motion of the device.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 表示设备绕 Y 轴的角度，单位是 角度 范围是 -90 到 90.
         * 这个值表示设备从前向后的旋转状态
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public gamma: number;
    }