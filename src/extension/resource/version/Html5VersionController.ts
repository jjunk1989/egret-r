// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace RES.web {

    /**
     * @private
     */
    export class Html5VersionController extends egret.EventDispatcher implements VersionController {

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

            /*

            todo

            let self = this;

            let virtualUrl:string = "all.manifest";

            let httpLoader:egret.HttpRequest = new egret.HttpRequest();
            httpLoader.addEventListener(egret.Event.COMPLETE, onLoadComplete, this);
            httpLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, this);

            httpLoader.open(virtualUrl + "?r=" + Date.now(), "get");
            httpLoader.send();

            function onError(event:egret.IOErrorEvent) {
                removeListeners();
                self.dispatchEvent(event);
            }

            function onLoadComplete() {
                removeListeners();

                self._versionInfo = JSON.parse(httpLoader.response);

                window.setTimeout(function () {
                    self.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
                }, 0);
            }

            function removeListeners():void {
                httpLoader.removeEventListener(egret.Event.COMPLETE, onLoadComplete, self);
                httpLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, onError, self);
            }

            */
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

            /*

            todo

            if (DEBUG) {
                return url;
            }
            if (this._versionInfo && this._versionInfo[url]) {
                return "resource/" + this._versionInfo[url]["v"].substring(0, 2) + "/" + this._versionInfo[url]["v"] + "_" + this._versionInfo[url]["s"] + "." + url.substring(url.lastIndexOf(".") + 1);
            }
            else {
                return url;
            }

            */
        }
    }

    VersionController = Html5VersionController;
}
