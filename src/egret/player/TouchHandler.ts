// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret.sys {

    /**
     * @private
     * 用户交互操作管理器
     */
    export class TouchHandler extends HashObject {

        private maxTouches: number = 0;
        private useTouchesCount: number = 0;

        /**
         * @private
         */
        public constructor(stage: Stage) {
            super();
            this.stage = stage;
        }

        /**
         * @private
         * 设置同时触摸数量
         */
        $initMaxTouches(): void {
            this.maxTouches = this.stage.$maxTouches;
        }

        /**
         * @private
         */
        private stage: Stage;

        /**
         * @private
         */
        private touchDownTarget: { [key: number]: DisplayObject } = {};

        /**
         * @private
         * 触摸开始（按下）
         * @param x 事件发生处相对于舞台的坐标x
         * @param y 事件发生处相对于舞台的坐标y
         * @param touchPointID 分配给触摸点的唯一标识号
         */
        public onTouchBegin(x: number, y: number, touchPointID: number): boolean {
            if (this.useTouchesCount >= this.maxTouches) {
                return;
            }
            this.lastTouchX = x;
            this.lastTouchY = y;

            let target = this.findTarget(x, y);
            if (this.touchDownTarget[touchPointID] == null) {
                this.touchDownTarget[touchPointID] = target;
                this.useTouchesCount++;
            }
            TouchEvent.dispatchTouchEvent(target, TouchEvent.TOUCH_BEGIN, true, true, x, y, touchPointID, true);
            //for 3D&2D
            return target !== this.stage;
        }

        /**
         * @private
         */
        private lastTouchX: number = -1;
        /**
         * @private
         */
        private lastTouchY: number = -1;

        /**
         * @private
         * 触摸移动
         * @param x 事件发生处相对于舞台的坐标x
         * @param y 事件发生处相对于舞台的坐标y
         * @param touchPointID 分配给触摸点的唯一标识号
         */
        public onTouchMove(x: number, y: number, touchPointID: number): boolean {
            if (this.touchDownTarget[touchPointID] == null) {
                return;
            }

            if (this.lastTouchX == x && this.lastTouchY == y) {
                return;
            }

            this.lastTouchX = x;
            this.lastTouchY = y;

            let target = this.findTarget(x, y);
            TouchEvent.dispatchTouchEvent(target, TouchEvent.TOUCH_MOVE, true, true, x, y, touchPointID, true);
            //for 3D&2D
            return target !== this.stage;
        }

        /**
         * @private
         * 触摸结束（弹起）
         * @param x 事件发生处相对于舞台的坐标x
         * @param y 事件发生处相对于舞台的坐标y
         * @param touchPointID 分配给触摸点的唯一标识号
         */
        public onTouchEnd(x: number, y: number, touchPointID: number): boolean {
            if (this.touchDownTarget[touchPointID] == null) {
                return;
            }

            let target = this.findTarget(x, y);
            let oldTarget = this.touchDownTarget[touchPointID];
            delete this.touchDownTarget[touchPointID];
            this.useTouchesCount--;

            TouchEvent.dispatchTouchEvent(target, TouchEvent.TOUCH_END, true, true, x, y, touchPointID, false);
            if (oldTarget == target) {
                TouchEvent.dispatchTouchEvent(target, TouchEvent.TOUCH_TAP, true, true, x, y, touchPointID, false);
            }
            else {
                TouchEvent.dispatchTouchEvent(oldTarget, TouchEvent.TOUCH_RELEASE_OUTSIDE, true, true, x, y, touchPointID, false);
            }
            //for 3D&2D
            return target !== this.stage;
        }

        /**
         * @private
         * 获取舞台坐标下的触摸对象
         */
        private findTarget(stageX: number, stageY: number): DisplayObject {
            let target = this.stage.$hitTest(stageX, stageY);
            if (!target) {
                target = this.stage;
            }
            return target;
        }

        //for 3D&2D
        /**
         * @private
         * 设置同时触摸数量
         */
        public $updateMaxTouches = function (value) {
            this.maxTouches = value;
        };
    }
}