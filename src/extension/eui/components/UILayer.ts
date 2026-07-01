// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { Event } from "../../../egret/events/Event";
import { Group } from "./Group";

    /**
     * The UILayer class is the subclass of the Group class.It not only has the standard function of the Group class,but also
     * can keep its size the same to the stage size (Stage.stageWidth,Stage.stageHeight).Its size will changes as the stage size changes.
     * like any normal container class,you can create multiple instance of the UILayer class,but it is usually used as the root of the UI display list.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * UILayer 是 Group 的子类，它除了具有容器的所有标准功能，还能够自动保持自身尺寸始终与舞台尺寸相同（Stage.stageWidth,Stage.stageHeight）。
     * 当舞台尺寸发生改变时，它会跟随舞台尺寸改变。UILayer 跟普通容器一样，允许创建多个实例，但通常都将它作为UI显示列表的根节点使用。
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @language zh_CN
     */
    export class UILayer extends Group {

        /**
         * Constructor.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 构造函数。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public constructor(){
            super();
            this.addEventListener(Event.ADDED_TO_STAGE,this.onAddToStage,this);
            this.addEventListener(Event.REMOVED_FROM_STAGE,this.onRemoveFromStage,this);
        }
        /**
         * @private
         * 添加到舞台
         */
        private onAddToStage(event?:Event):void{
            this.$stage.addEventListener(Event.RESIZE,this.onResize,this);
            this.onResize();
        }
        /**
         * @private
         * 从舞台移除
         */
        private onRemoveFromStage(event:Event):void{
            this.$stage.removeEventListener(Event.RESIZE,this.onResize,this);
        }

        /**
         * @private
         * 舞台尺寸改变
         */
        private onResize(event?:Event):void{
            let stage = this.$stage;
            this.$setWidth(stage.$stageWidth);
            this.$setHeight(stage.$stageHeight);
        }
    }