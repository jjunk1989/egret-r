// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


    /**
     * @version Egret 2.4
     * @platform Web
     */
    export class NumberUtils {

        /**
         * Judge whether it is a numerical value
         * @param value Parameter that needs to be judged
         * @returns 
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 判断是否是数值
         * @param value 需要判断的参数
         * @returns
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static isNumber(value:any):boolean {
            return typeof(value) === "number" && !isNaN(value);
        }

        /**
         * Obtain the approximate sin value of the corresponding angle value
         * @param value {number} Angle value
         * @returns {number} sin value
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 得到对应角度值的sin近似值
         * @param value {number} 角度值
         * @returns {number} sin值
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static sin(value:number):number {
            let valueFloor:number = Math.floor(value);
            let valueCeil:number = valueFloor + 1;
            let resultFloor:number = NumberUtils.sinInt(valueFloor);
            if (valueFloor == value) {
                return resultFloor;
            }
            let resultCeil:number = NumberUtils.sinInt(valueCeil);

            return (value - valueFloor) * resultCeil + (valueCeil - value) * resultFloor;
        }

        /**
         * @private
         * 
         * @param value 
         * @returns 
         */
        private static sinInt(value:number):number
        {
            value = value % 360;
            if (value < 0) {
                value += 360;
            }
            return egret_sin_map[value];
        }

        /**
         * Obtain the approximate cos value of the corresponding angle value
         * @param value {number} Angle value
         * @returns {number} cos value
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 得到对应角度值的cos近似值
         * @param value {number} 角度值
         * @returns {number} cos值
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static cos(value:number):number {
            let valueFloor:number = Math.floor(value);
            let valueCeil:number = valueFloor + 1;
            let resultFloor:number = NumberUtils.cosInt(valueFloor);
            if (valueFloor == value) {
                return resultFloor;
            }
            let resultCeil:number = NumberUtils.cosInt(valueCeil);

            return (value - valueFloor) * resultCeil + (valueCeil - value) * resultFloor;
        }

        /**
         * @private
         * 
         * @param value 
         * @returns 
         */
        private static cosInt(value:number):number
        {
            value = value % 360;
            if (value < 0) {
                value += 360;
            }
            return egret_cos_map[value];
        }


        public static convertStringToHashCode(str: string): number {
            if (str.length === 0) {
                return 0;
            }
            let hash = 0;
            for (let i = 0, length = str.length; i < length; ++i) {
                const chr = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        }

    }

/**
 * @private
 */
let egret_sin_map = {};
/**
 * @private
 */
let egret_cos_map = {};
/**
 * @private
 */
let DEG_TO_RAD:number = Math.PI / 180;

for (let NumberUtils_i = 0; NumberUtils_i < 360; NumberUtils_i++) {
    egret_sin_map[NumberUtils_i] = Math.sin(NumberUtils_i * DEG_TO_RAD);
    egret_cos_map[NumberUtils_i] = Math.cos(NumberUtils_i * DEG_TO_RAD);
}
egret_sin_map[90] = 1;
egret_cos_map[90] = 0;
egret_sin_map[180] = 0;
egret_cos_map[180] = -1;
egret_sin_map[270] = -1;
egret_cos_map[270] = 0;

//对未提供bind的浏览器实现bind机制
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            $error(1029);
        }

        let aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {
            },
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                        ? this
                        : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}