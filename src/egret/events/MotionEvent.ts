// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { Event } from "./Event";
import { DeviceAcceleration, DeviceRotationRate } from "../sensor/Motion";

    /**
     * MotionEvent represents the device's movement
     * Acceleration and accelerationIncludingGravity to represents the device's acceleration
     * RotationRate to represents the device's rotation
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/sensor/Motion.ts
     * @language en_US
     */
    /**
     * MotionEvent 类呈现设备运动的具体信息
     * Acceleration 和 accelerationIncludingGravity 呈现设备三个维度的加速度信息
     * RotationRate 呈现设备的旋转状态信息
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/sensor/Motion.ts
     * @language zh_CN
     */
    export class MotionEvent extends Event {
        /**
         * An object giving the acceleration of the device on the three axis X, Y and Z. Acceleration is expressed in m/s2.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * acceleration 表示设备在 X Y Z 轴方将的加速度信息，单位是  m/s2，不包含重力
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        acceleration: DeviceAcceleration;
        /**
         * An object giving the acceleration of the device on the three axis X, Y and Z with the effect of gravity. Acceleration is expressed in m/s2.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * acceleration 表示设备在 X Y Z 轴方将的加速度信息，单位是  m/s2，包含重力
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        accelerationIncludingGravity: DeviceAcceleration;
        /**
         * An object giving the rate of change of the device's orientation on the three orientation axis alpha, beta and gamma. Rotation rate is express in degrees per seconds.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * rotationRate 表示设备在 alpha、 beta 和 gamma 三个轴向的角速度信息，单位是 角度每秒
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        rotationRate: DeviceRotationRate;
    }