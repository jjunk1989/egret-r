// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace eui {

    export interface IAssetAdapter {

        getAsset(source: string, callBack: (content: any, source: string) => void, thisObject: any): void;
    }
}