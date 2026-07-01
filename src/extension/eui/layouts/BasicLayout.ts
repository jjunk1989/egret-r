// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { Point, $TempPoint } from "../../../egret/geom/Point";
import { Rectangle, $TempRectangle } from "../../../egret/geom/Rectangle";
import { UIComponent, UIKeys } from "../core/UIComponent";
import { Group } from "../components/Group";
import { Component } from "../components/Component";
import { LayoutBase } from "./supportClasses/LayoutBase";
import { $error } from "../../../Defines.debug";
import { DEBUG } from "../../../Defines.debug";
import { is } from "../../../egret/utils/is";


    /**
     * The BasicLayout class arranges the layout elements according to their individual settings,
     * independent of each-other. BasicLayout, also called absolute layout, requires that you
     * explicitly position each container child.
     * You can use the <code>x</code> and <code>y</code> properties of the child,
     * or constraints to position each child.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @includeExample  extension/eui/layout/BasicLayoutExample.ts
     * @language en_US
     */
    /**
     * BasicLayout 类根据其各个设置彼此独立地排列布局元素。
     * BasicLayout（也称为绝对布局）要求显式定位每个容器子代。
     * 可以使用子代的 <code>x</code> 和 <code>y</code> 属性，或使用约束来定位每个子代。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @includeExample  extension/eui/layout/BasicLayoutExample.ts
     * @language zh_CN
     */
    export class BasicLayout extends LayoutBase {

        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 构造函数。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public constructor() {
            super();
        }


        /**
         * BasicLayout does not support virtual layout, setting this property is invalid.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * BasicLayout不支持虚拟布局，设置这个属性无效。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public useVirtualLayout:boolean;

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public measure():void {
            super.measure();
            sys.measure(this.$target);
        }


        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
            super.updateDisplayList(unscaledWidth, unscaledHeight);
            let target = this.$target;
            let pos = sys.updateDisplayList(target, unscaledWidth, unscaledHeight);
            target.setContentSize(Math.ceil(pos.x), Math.ceil(pos.y));
        }
    }

    if (DEBUG) {
        Object.defineProperty(BasicLayout.prototype, "useVirtualLayout", {
            /**
             * 此布局不支持虚拟布局，设置这个属性无效
             */
            get: function () {
                return this.$useVirtualLayout;
            },
            set: function (value) {
                $error(2201);
            },
            enumerable: true,
            configurable: true
        });
    }


    let UIComponentClass = "UIComponent";

    /**
     * @private
     * @param value 要格式化的相对值
     * @param total 在此值方向上的总长度
     */
    function formatRelative(value:number|string, total:number):number {
        if (!value || typeof value == "number") {
            return <number>value;
        }
        let str = <string>value;
        let index = str.indexOf("%");
        if (index == -1) {
            return +str;
        }
        let percent = +str.substring(0, index);
        return percent * 0.01 * total;
    }

    /**
     * @private
     * 一个工具方法，使用BasicLayout规则测量目标对象。
     */
    export function measure(target:Group|Component):void {
        if (!target) {
            return;
        }
        let width = 0;
        let height = 0;
        let bounds = $TempRectangle;
        let count = target.numChildren;
        for (let i = 0; i < count; i++) {
            let layoutElement = <UIComponent> (target.getChildAt(i));
            if (!is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                continue;
            }

            let values = layoutElement.$UIComponent;
            let hCenter = +values[UIKeys.horizontalCenter];
            let vCenter = +values[UIKeys.verticalCenter];
            let left = +values[UIKeys.left];
            let right = +values[UIKeys.right];
            let top = +values[UIKeys.top];
            let bottom = +values[UIKeys.bottom];

            let extX:number;
            let extY:number;

            layoutElement.getPreferredBounds(bounds);

            if (!isNaN(left) && !isNaN(right)) {
                extX = left + right;
            }
            else if (!isNaN(hCenter)) {
                extX = Math.abs(hCenter) * 2;
            }
            else if (!isNaN(left) || !isNaN(right)) {
                extX = isNaN(left) ? 0 : left;
                extX += isNaN(right) ? 0 : right;
            }
            else {
                extX = bounds.x;
            }

            if (!isNaN(top) && !isNaN(bottom)) {
                extY = top + bottom;
            }
            else if (!isNaN(vCenter)) {
                extY = Math.abs(vCenter) * 2;
            }
            else if (!isNaN(top) || !isNaN(bottom)) {
                extY = isNaN(top) ? 0 : top;
                extY += isNaN(bottom) ? 0 : bottom;
            }
            else {
                extY = bounds.y;
            }

            let preferredWidth = bounds.width;
            let preferredHeight = bounds.height;
            width = Math.ceil(Math.max(width, extX + preferredWidth));
            height = Math.ceil(Math.max(height, extY + preferredHeight));
        }

        target.setMeasuredSize(width, height);
    }

    /**
     * @private
     * 一个工具方法，使用BasicLayout规则布局目标对象。
     */
    export function updateDisplayList(target:Group|Component,
                                      unscaledWidth:number, unscaledHeight:number):Point {
        if (!target)
            return;

        let count = target.numChildren;

        let maxX = 0;
        let maxY = 0;
        let bounds = $TempRectangle;
        for (let i = 0; i < count; i++) {
            let layoutElement = <UIComponent> (target.getChildAt(i));
            if (!is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                continue;
            }

            let values = layoutElement.$UIComponent;
            let hCenter = formatRelative(values[UIKeys.horizontalCenter], unscaledWidth*0.5);
            let vCenter = formatRelative(values[UIKeys.verticalCenter], unscaledHeight*0.5);
            let left = formatRelative(values[UIKeys.left], unscaledWidth);
            let right = formatRelative(values[UIKeys.right], unscaledWidth);
            let top = formatRelative(values[UIKeys.top], unscaledHeight);
            let bottom = formatRelative(values[UIKeys.bottom], unscaledHeight);
            let percentWidth = values[UIKeys.percentWidth];
            let percentHeight = values[UIKeys.percentHeight];

            let childWidth = NaN;
            let childHeight = NaN;

            if (!isNaN(left) && !isNaN(right)) {
                childWidth = unscaledWidth - right - left;
            }
            else if (!isNaN(percentWidth)) {
                childWidth = Math.round(unscaledWidth * Math.min(percentWidth * 0.01, 1));
            }

            if (!isNaN(top) && !isNaN(bottom)) {
                childHeight = unscaledHeight - bottom - top;
            }
            else if (!isNaN(percentHeight)) {
                childHeight = Math.round(unscaledHeight * Math.min(percentHeight * 0.01, 1));
            }

            layoutElement.setLayoutBoundsSize(childWidth, childHeight);
            layoutElement.getLayoutBounds(bounds);
            let elementWidth = bounds.width;
            let elementHeight = bounds.height;


            let childX = NaN;
            let childY = NaN;

            if (!isNaN(hCenter))
                childX = Math.round((unscaledWidth - elementWidth) / 2 + hCenter);
            else if (!isNaN(left))
                childX = left;
            else if (!isNaN(right))
                childX = unscaledWidth - elementWidth - right;
            else
                childX = bounds.x;

            if (!isNaN(vCenter))
                childY = Math.round((unscaledHeight - elementHeight) / 2 + vCenter);
            else if (!isNaN(top))
                childY = top;
            else if (!isNaN(bottom))
                childY = unscaledHeight - elementHeight - bottom;
            else
                childY = bounds.y;

            layoutElement.setLayoutBoundsPosition(childX, childY);

            maxX = Math.max(maxX, childX + elementWidth);
            maxY = Math.max(maxY, childY + elementHeight);
        }
        return $TempPoint.setTo(maxX, maxY);
    }