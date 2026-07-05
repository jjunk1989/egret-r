// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


import { egret } from '@egret-r/core';
const { HttpResponseType } = egret;
import { BinAnalyzer } from "./BinAnalyzer";

    /**
     * @private
     */
    export class TextAnalyzer extends BinAnalyzer{

        public constructor(){
            super();
            this._dataFormat = HttpResponseType.TEXT;
        }
    }