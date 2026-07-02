// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { nativeRender } from "../player/Player";
import { ticker, SystemTicker } from "../player/SystemTicker";
import { runEgretOptions } from "../player/EgretEntry";
import { screenAdapter, setScreenAdapter, DefaultScreenAdapter } from "../player/ScreenAdapter";
import { CanvasRenderBuffer, canvasHitTestBuffer, RenderBuffer, customHitTestBuffer, setCanvasHitTestBuffer, setCustomHitTestBuffer } from "../player/RenderBuffer";
import { DisplayList } from "../player/DisplayList";
import { systemRenderer, canvasRenderer, setSystemRenderer, setCanvasRenderer } from "../player/SystemRenderer";
import { WebPlayer } from "./WebPlayer";
import { WebGLRenderer } from "./rendering/webgl/WebGLRenderer";
import { CanvasRenderer } from "../player/rendering/CanvasRenderer";
import { WebGLRenderBuffer } from "./rendering/webgl/WebGLRenderBuffer";
import { WebGLRenderContext } from "./rendering/webgl/WebGLRenderContext";
import { DEBUG } from "../../Defines.debug";
import { $warn } from "../../Defines.debug";
import { $locale_strings, $language, set$language } from "../i18n/tr";
import { Html5Capatibility } from "./Html5Capatibility";
import { Capabilities, RuntimeType } from "../system/Capabilities";
import { WebGLUtils } from "./rendering/webgl/WebGLUtils";

    /**
     * @private
     * 刷新所有Egret播放器的显示区域尺寸。仅当使用外部JavaScript代码动态修改了Egret容器大小时，需要手动调用此方法刷新显示区域。
     * 当网页尺寸发生改变时此方法会自动被调用。
     */
    function updateAllScreens(): void {
        if (!isRunning) {
            return;
        }
        let containerList = document.querySelectorAll(".egret-player");
        let length = containerList.length;
        for (let i = 0; i < length; i++) {
            let container = containerList[i];
            let player = <WebPlayer>container["egret-player"];
            player.updateScreenSize();
        }
    }

    let isRunning: boolean = false;

    /**
     * @private
     * 网页加载完成，实例化页面中定义的Egret标签
     */
    function runEgret(options?: runEgretOptions): void {
        if (isRunning) {
            return;
        }
        isRunning = true;
        if (!options) {
            options = {};
        }
        let ua: string = navigator.userAgent.toLowerCase();
        if (ua.indexOf("egretnative") >= 0 && ua.indexOf("egretwebview") == -1) {
            Capabilities["runtimeType" + ""] = RuntimeType.RUNTIME2;
        }

        // 是否启动3d环境
        if (options.pro) {
            egret.pro.egret2dDriveMode = true;
            try {
                if (window['startup']) {
                    window['startup']();
                } else {
                    console.error("EgretPro.js don't has function:window.startup");
                }
            } catch (e) {
                console.error(e);
            }
        }

        if (ua.indexOf("egretnative") >= 0 && nativeRender) {// Egret Native
            egret_native.addModuleCallback(function () {
                Html5Capatibility.$init();

                // WebGL上下文参数自定义
                if (options.renderMode == "webgl") {
                    // WebGL抗锯齿默认关闭，提升PC及某些平台性能
                    let antialias = options.antialias;
                    WebGLRenderContext.antialias = !!antialias;
                }

                sys.CanvasRenderBuffer = CanvasRenderBuffer;
                setRenderMode(options.renderMode);
                egret_native.nrSetRenderMode(2);

                let canvasScaleFactor;
                if (options.canvasScaleFactor) {
                    canvasScaleFactor = options.canvasScaleFactor;
                }
                else if (options.calculateCanvasScaleFactor) {
                    canvasScaleFactor = options.calculateCanvasScaleFactor(canvasHitTestBuffer.context);
                }
                else {
                    canvasScaleFactor = window.devicePixelRatio;
                }
                DisplayList.$canvasScaleFactor = canvasScaleFactor;

                let ticker = ticker;
                startTicker(ticker);
                if (options.screenAdapter) {
                    setScreenAdapter(options.screenAdapter);
                }
                else if (!screenAdapter) {
                    setScreenAdapter(new DefaultScreenAdapter)();
                }

                let list = document.querySelectorAll(".egret-player");
                let length = list.length;
                for (let i = 0; i < length; i++) {
                    let container = <HTMLDivElement>list[i];
                    let player = new WebPlayer(container, options);
                    container["egret-player"] = player;
                }
                window.addEventListener("resize", function () {
                    if (isNaN(resizeTimer)) {
                        resizeTimer = window.setTimeout(doResize, 300);
                    }
                });
            }, null);
            egret_native.initNativeRender();
        }
        else {
            Html5Capatibility._audioType = options.audioType;
            Html5Capatibility.$init();
            let renderMode = options.renderMode;
            // WebGL上下文参数自定义
            if (renderMode == "webgl") {
                // WebGL抗锯齿默认关闭，提升PC及某些平台性能
                let antialias = options.antialias;
                WebGLRenderContext.antialias = !!antialias;
                // WebGLRenderContext.antialias = (typeof antialias == undefined) ? true : antialias;
            }

            sys.CanvasRenderBuffer = CanvasRenderBuffer;
            if (ua.indexOf("egretnative") >= 0 && renderMode != "webgl") {
                $warn(1051);
                renderMode = "webgl";
            }
            setRenderMode(renderMode);

            let canvasScaleFactor;
            if (options.canvasScaleFactor) {
                canvasScaleFactor = options.canvasScaleFactor;
            }
            else if (options.calculateCanvasScaleFactor) {
                canvasScaleFactor = options.calculateCanvasScaleFactor(canvasHitTestBuffer.context);
            }
            else {
                //based on : https://github.com/jondavidjohn/hidpi-canvas-polyfill
                let context = canvasHitTestBuffer.context;
                let backingStore = context.backingStorePixelRatio ||
                    context.webkitBackingStorePixelRatio ||
                    context.mozBackingStorePixelRatio ||
                    context.msBackingStorePixelRatio ||
                    context.oBackingStorePixelRatio ||
                    context.backingStorePixelRatio || 1;
                canvasScaleFactor = (window.devicePixelRatio || 1) / backingStore;
            }
            DisplayList.$canvasScaleFactor = canvasScaleFactor;

            let ticker = ticker;
            startTicker(ticker);
            if (options.screenAdapter) {
                setScreenAdapter(options.screenAdapter);
            }
            else if (!screenAdapter) {
                setScreenAdapter(new DefaultScreenAdapter)();
            }

            let list = document.querySelectorAll(".egret-player");
            let length = list.length;
            for (let i = 0; i < length; i++) {
                let container = <HTMLDivElement>list[i];
                let player = new WebPlayer(container, options);
                container["egret-player"] = player;
            }

            window.addEventListener("resize", function () {
                if (isNaN(resizeTimer)) {
                    resizeTimer = window.setTimeout(doResize, 300);
                }
            });
        }
    }

    /**
     * 设置渲染模式。"auto","webgl","canvas"
     * @param renderMode
     */
    function setRenderMode(renderMode: string): void {
        if (renderMode == "webgl" && WebGLUtils.checkCanUseWebGL()) {
            sys.RenderBuffer = WebGLRenderBuffer;
            setSystemRenderer(new WebGLRenderer());
            setCanvasRenderer(new CanvasRenderer());
            setCustomHitTestBuffer(new WebGLRenderBuffer(3, 3));
            setCanvasHitTestBuffer(new CanvasRenderBuffer(3, 3));
            Capabilities["renderMode" + ""] = "webgl";
        }
        else {
            sys.RenderBuffer = CanvasRenderBuffer;
            setSystemRenderer(new CanvasRenderer());
            setCanvasRenderer(systemRenderer);
            setCustomHitTestBuffer(new CanvasRenderBuffer(3, 3));
            setCanvasHitTestBuffer(customHitTestBuffer);
            Capabilities["renderMode" + ""] = "canvas";
        }
    }


    sys.setRenderMode = setRenderMode;

    /**
     * @private
     * 启动心跳计时器。
     */
    function startTicker(ticker: SystemTicker): void {
        let requestAnimationFrame =
            window["requestAnimationFrame"] ||
            window["webkitRequestAnimationFrame"] ||
            window["mozRequestAnimationFrame"] ||
            window["oRequestAnimationFrame"] ||
            window["msRequestAnimationFrame"];

        if (!requestAnimationFrame) {
            requestAnimationFrame = function (callback) {
                return window.setTimeout(callback, 1000 / 60);
            };
        }

        requestAnimationFrame(onTick);
        function onTick(): void {
            requestAnimationFrame(onTick);
            ticker.update();
        }
    }

    //覆盖原生的isNaN()方法实现，在不同浏览器上有2~10倍性能提升。
    window["isNaN"] = function (value: number): boolean {
        value = +value;
        return value !== value;
    };

    egret.runEgret = runEgret;
    egret.updateAllScreens = updateAllScreens;

    let resizeTimer: number = NaN;

    function doResize() {
        resizeTimer = NaN;
        updateAllScreens();
    }


if (DEBUG) {
    let language = navigator.language || navigator["browserLanguage"] || "en_US";
    language = language.replace("-", "_");

    if (language in $locale_strings)
        set$language(language);
}
