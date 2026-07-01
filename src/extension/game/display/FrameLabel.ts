// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { EventDispatcher } from "../../../egret/events/EventDispatcher";


    /**
     * @version Egret 2.4
     * @platform Web
     * @private
     */
    export class FrameLabel extends EventDispatcher {
        /**
         * @private
         */
        private _name:string;
        /**
         * @private
         */
        private _frame:number /*int*/;
        /**
         * @private
         */
        private _end:number /*int*/;
        /**
         * @version Egret 2.4
         * @platform Web
         */
        constructor(name:string, frame:number /*int*/, end?:number /*int*/) {
            super();
            this._name = name;
            this._frame = frame | 0;
            if (end) this._end = end | 0;
        }

        /**
         * Frame number
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 标签名
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public get name():string {
            return this._name;
        }

        /**
         * Frame serial number of the label
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 标签所在帧序号
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public get frame():number /*int*/ {
            return this._frame;
        }
        /**
         * Frame serial number, the end of the label
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 标签对应的结束帧序号
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public get end(): number /*int*/ {
            return this._end;
        }

        /**
         * Duplicate the current frame label object
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 复制当前帧标签对象
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public clone() {
            return new FrameLabel(this._name, this._frame, this._end);
        }
    }


