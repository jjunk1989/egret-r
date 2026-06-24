// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


namespace egret {
    /**
     * @private
     * @version Egret 2.4
     * @platform Web
     */
    export interface StageText extends EventDispatcher {
        /**
         * @private
         */
        $textfield:egret.TextField;
        /**
         * @private
         * 
         * @param textfield 
         */
        $setTextField(textfield:egret.TextField):boolean;

        /**
         * @private
         * 
         */
        $resetStageText():void;

        /**
         * @private
         * 
         * @returns 
         */
        $getText():string;
        /**
         * @private
         * 
         * @param value 
         */
        $setText(value:string):boolean;
        /**
         * @private
         *
         * @param value
         */
        $setColor(value:number):boolean;
        /**
         * @private
         * 
         */
        $show(active?: boolean):void;
        /**
         * @private
         * 
         */
        $hide():void;

        /**
         * @private
         * 
         */
        $addToStage():void;
        /**
         * @private
         * 
         */
        $removeFromStage():void;

        /**
         * @private
         *
         */
        $onBlur():void;
    }

    /**
     * @version Egret 2.4
     * @platform Web
     */
    export let StageText:{new():StageText};
}