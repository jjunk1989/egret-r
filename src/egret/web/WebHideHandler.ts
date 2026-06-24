// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret.web {
    /**
     * @private
     */
    export let WebLifeCycleHandler: egret.lifecycle.LifecyclePlugin = (context) => {

        const resume = () => {
            context.resume();
            /** 解决 ios13 页面切到后台再拉起，声音无法播放 */
            if (Html5Capatibility._audioType == AudioType.WEB_AUDIO && WebAudioDecode.initAudioContext) {
                WebAudioDecode.initAudioContext();
            }
        }

        const pause = () => {
            context.pause();
        }


        let handleVisibilityChange = function () {
            if (!document[hidden]) {
                resume();
            }
            else {
                pause();
            }
        };

        window.addEventListener("focus", resume, false);
        window.addEventListener("blur", pause, false);

        let hidden, visibilityChange;
        if (typeof document.hidden !== "undefined") {
            hidden = "hidden";
            visibilityChange = "visibilitychange";
        } else if (typeof document["mozHidden"] !== "undefined") {
            hidden = "mozHidden";
            visibilityChange = "mozvisibilitychange";
        } else if (typeof document["msHidden"] !== "undefined") {
            hidden = "msHidden";
            visibilityChange = "msvisibilitychange";
        } else if (typeof document["webkitHidden"] !== "undefined") {
            hidden = "webkitHidden";
            visibilityChange = "webkitvisibilitychange";
        } else if (typeof document["oHidden"] !== "undefined") {
            hidden = "oHidden";
            visibilityChange = "ovisibilitychange";
        }
        if ("onpageshow" in window && "onpagehide" in window) {
            window.addEventListener("pageshow", resume, false);
            window.addEventListener("pagehide", pause, false);
        }
        if (hidden && visibilityChange) {
            document.addEventListener(visibilityChange, handleVisibilityChange, false);
        }

        let ua = navigator.userAgent;
        let isWX = /micromessenger/gi.test(ua);
        let isQQBrowser = /mqq/ig.test(ua);
        let isQQ = /mobile.*qq/gi.test(ua);

        if (isQQ || isWX) {
            isQQBrowser = false;
        }
        if (isQQBrowser) {
            let browser = window["browser"] || {};
            browser.execWebFn = browser.execWebFn || {};
            browser.execWebFn.postX5GamePlayerMessage = function (event) {
                let eventType = event.type;
                if (eventType == "app_enter_background") {
                    pause();
                }
                else if (eventType == "app_enter_foreground") {
                    resume();
                }
            };
            window["browser"] = browser;
        }
    }
}