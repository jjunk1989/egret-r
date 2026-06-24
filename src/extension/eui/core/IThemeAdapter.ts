// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace eui {

    export interface IThemeAdapter {

        getTheme(url: string, compFunc: Function, errorFunc: Function, thisObject: any): void;
    }
}