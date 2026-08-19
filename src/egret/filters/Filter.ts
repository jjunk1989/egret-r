// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


import { HashObject } from "../utils/HashObject";

    /**
     * @private
     * @version Egret 2.4
     * @platform Web
     */
    export class Filter extends HashObject {
        /**
         * @version Egret 2.4
         * @platform Web
         */
        public type:string = null;

        /**
         * @private
         */
        public $id: number = null;


        /**
         * @private 
         */
        public $uniforms:any;

        /**
         * @private 
         */
        protected paddingTop: number = 0;
        /**
         * @private 
         */
        protected paddingBottom: number = 0;
        /**
         * @private 
         */
        protected paddingLeft: number = 0;
        /**
         * @private 
         */
        protected paddingRight: number = 0;
        
        /**
         * @private
         * @native Render
         */
        public $obj: any;

        constructor() {
            super();
            this.$uniforms = {};
            if (nativeRender) {
               egret_native.NativeDisplayObject.createFilter(this);
            }
        }

        /**
         * @private
         */
        public $toJson():string {
            return '';
        }

        protected updatePadding(): void {

        }

        public onPropertyChange(): void {
            let self = this;
            self.updatePadding();
            if (nativeRender) {
                egret_native.NativeDisplayObject.setFilterPadding(self.$id, self.paddingTop, self.paddingBottom, self.paddingLeft, self.paddingRight);
                egret_native.NativeDisplayObject.setDataToFilter(self);
            }
        }
    }