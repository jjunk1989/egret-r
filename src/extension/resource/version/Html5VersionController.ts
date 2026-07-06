// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


import { egret } from '@egret-r/core';
const { EventDispatcher, HttpRequest, IOErrorEvent, Event } = egret;
import { VersionController } from "./IVersionController";
import { DEBUG } from "../../../Defines.debug";

    /**
     * @private
     */
    export class Html5VersionController extends EventDispatcher implements VersionController {

        constructor() {
            super();
        }

        private _versionInfo: Object = {};

        public fetchVersion(callback: {

            onSuccess: (data: any) => any;

            onFail: (error: number, data: any) => any;

        }): void {

            callback.onSuccess(null);
            return;
        }

        /**
         * 获取所有有变化的文件
         * @returns {any[]}
         */
        public getChangeList(): Array<{ url: string; size: number }> {
            return [];
        }

        public getVirtualUrl(url: string): string {

            return url;
        }
    }

    egret.VersionController = Html5VersionController;
