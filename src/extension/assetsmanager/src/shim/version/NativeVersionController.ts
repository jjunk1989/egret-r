// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


import { egret } from '@egret-r/core';
const { Capabilities } = egret;
import { IVersionController } from "./IVersionController";

    interface R {
        v: string,
        s: number
    }
    /**
     * @private
     */
    export class NativeVersionController implements IVersionController {

        private versionInfo: { [url: string]: R };
        init() {
            this.versionInfo = this.getLocalData("all.manifest");
            return Promise.resolve();
        }
        public getVirtualUrl(url: string): string {
            return url;
        }

        private getLocalData(filePath): any {
            if (egret_native.readUpdateFileSync && egret_native.readResourceFileSync) {
                //先取更新目录
                var content: string = egret_native.readUpdateFileSync(filePath);
                if (content != null) {
                    return JSON.parse(content);
                }
                //再取资源目录
                content = egret_native.readResourceFileSync(filePath);
                if (content != null) {
                    return JSON.parse(content);
                }
            }
            return null;
        }
    }
    if (Capabilities.runtimeType == "native") {
        VersionController = NativeVersionController;
    }