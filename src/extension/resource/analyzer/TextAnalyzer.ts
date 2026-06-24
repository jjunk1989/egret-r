// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


namespace RES {
    /**
     * @private
     */
    export class TextAnalyzer extends BinAnalyzer{

        public constructor(){
            super();
            this._dataFormat = egret.HttpResponseType.TEXT;
        }
    }
}