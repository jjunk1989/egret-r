// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { Capabilities } from "../system/Capabilities";


    /**
     * @private
     */
    export class WebCapability {
        /**
         * @private
         * 检测系统属性
         */
        public static detect(): void {
            let capabilities = Capabilities;
            let ua = navigator.userAgent.toLowerCase();
            capabilities["isMobile" + ""] = (ua.indexOf('mobile') != -1 || ua.indexOf('android') != -1);
            if (capabilities.isMobile) {
                if (ua.indexOf("windows") < 0 && (ua.indexOf("iphone") != -1 || ua.indexOf("ipad") != -1 || ua.indexOf("ipod") != -1)) {
                    capabilities["os" + ""] = "iOS";
                }else if (ua.indexOf("android") != -1 && ua.indexOf("linux") != -1) {
                    capabilities["os" + ""] = "Android";
                }
                else if (ua.indexOf("windows") != -1) {
                    capabilities["os" + ""] = "Windows Phone";
                }
            }
            else {
                if (ua.indexOf("windows nt") != -1) {
                    capabilities["os" + ""] = "Windows PC";
                }else if(navigator.platform == "MacIntel" && navigator.maxTouchPoints > 1){//ios 13 Request Desktop Website
                    capabilities["os" + ""] = "iOS";
                    capabilities["isMobile" + ""] = true;
                }else if (ua.indexOf("mac os") != -1) {
                    capabilities["os" + ""] = "Mac OS";
                }
            }

            let language = (navigator.language || navigator["browserLanguage"]).toLowerCase();
            let strings = language.split("-");
            if (strings.length > 1) {
                strings[1] = strings[1].toUpperCase();
            }
            capabilities["language" + ""] = strings.join("-");
        }
    }
    WebCapability.detect();
