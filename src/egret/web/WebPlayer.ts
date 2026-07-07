// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { HashObject } from "../utils/HashObject";
import { Capabilities } from "../system/Capabilities";
import { Stage } from "../display/Stage";
import { nativeRender, Player } from "../player/Player";
import { StageOrientationEvent } from "../events/StageOrientationEvent";
import { StageScaleMode } from "../player/StageScaleMode";
import { OrientationMode } from "../display/OrientationMode";
import { Matrix } from "../geom/Matrix";
import { Screen } from "../player/Screen";
import { screenAdapter } from "../player/ScreenAdapter";
import { RenderBuffer } from "../player/RenderBuffer";
import { DisplayList } from "../player/DisplayList";
import { runEgretOptions } from "../player/EgretEntry";
import { PlayerOption } from "../player/PlayerOption";
import { WebTouchHandler } from "./WebTouchHandler";
import { HTMLInput, $cacheTextAdapter } from "../text/web/HTML5StageText";
import { lifecycle } from "../player/SystemTicker";
import { WebLifeCycleHandler } from "./WebHideHandler";
import { getPrefixStyleName } from "./Html5Capatibility";

    /**
     * @private
     */
    export class WebPlayer extends HashObject implements Screen {

        public constructor(container: HTMLDivElement, options: runEgretOptions) {
            super();
            this.init(container, options);
            this.initOrientation();
        }

        private init(container: HTMLDivElement, options: runEgretOptions): void {
            console.egret.log("Egret Engine Version:", Capabilities.engineVersion)
            let option = this.readOption(container, options);
            let stage = new Stage();
            stage.$screen = this;
            stage.$scaleMode = option.scaleMode;
            stage.$orientation = option.orientation;
            stage.$maxTouches = option.maxTouches;
            stage.frameRate = option.frameRate;
            stage.textureScaleFactor = option.textureScaleFactor;

            let buffer = new (sys.RenderBuffer)(undefined, undefined, true);
            let canvas = <HTMLCanvasElement>buffer.surface;
            this.attachCanvas(container, canvas);

            let webTouch = new WebTouchHandler(stage, canvas);
            let player = new Player(buffer, stage, option.entryClassName);

            lifecycle.stage = stage;
            lifecycle.addLifecycleListener(WebLifeCycleHandler);

            let webInput = new HTMLInput();

            if (option.showFPS || option.showLog) {
                if (!nativeRender) {
                    player.displayFPS(option.showFPS, option.showLog, option.logFilter, option.fpsStyles);
                }
            }
            this.playerOption = option;
            this.container = container;
            this.canvas = canvas;
            this.stage = stage;
            this.player = player;
            this.webTouchHandler = webTouch;
            this.webInput = webInput;

            webInput.finishUserTyping = () => {
                if (this.updateAfterTyping) {
                    setTimeout(() => {
                        this.updateScreenSize();
                        this.updateAfterTyping = false;
                    }, 300);
                }
            }
            $cacheTextAdapter(webInput, stage, container, canvas);

            this.updateScreenSize();
            this.updateMaxTouches();
            player.start();
        }

        private initOrientation(): void {
            let self = this;
            window.addEventListener("orientationchange", function () {
                window.setTimeout(function () {
                    StageOrientationEvent.dispatchStageOrientationEvent(self.stage, StageOrientationEvent.ORIENTATION_CHANGE);
                }, 350);
            });
        }

        /**
         * 读取初始化参数
         */
        private readOption(container: HTMLDivElement, options: runEgretOptions): PlayerOption {
            let option: PlayerOption = {};
            option.entryClassName = container.getAttribute("data-entry-class");
            option.scaleMode = container.getAttribute("data-scale-mode") || StageScaleMode.NO_SCALE;
            option.frameRate = +container.getAttribute("data-frame-rate") || 30;
            option.contentWidth = +container.getAttribute("data-content-width") || 480;
            option.contentHeight = +container.getAttribute("data-content-height") || 800;
            option.orientation = container.getAttribute("data-orientation") || OrientationMode.AUTO;
            option.maxTouches = +container.getAttribute("data-multi-fingered") || 2;
            option.textureScaleFactor = +container.getAttribute("texture-scale-factor") || 1;

            option.showFPS = container.getAttribute("data-show-fps") === "true";

            let styleStr = container.getAttribute("data-show-fps-style") || "";
            let stylesArr = styleStr.split(",");
            let styles = {};
            for (let i = 0; i < stylesArr.length; i++) {
                let tempStyleArr = stylesArr[i].split(":");
                styles[tempStyleArr[0]] = tempStyleArr[1];
            }
            option.fpsStyles = styles;

            option.showLog = container.getAttribute("data-show-log") === "true";
            option.logFilter = container.getAttribute("data-log-filter");
            return option;
        }

        /**
         * @private
         * 添加canvas到container。
         */
        private attachCanvas(container: HTMLElement, canvas: HTMLCanvasElement): void {

            let style = canvas.style;
            style.cursor = "inherit";
            style.position = "absolute";
            style.top = "0";
            style.bottom = "0";
            style.left = "0";
            style.right = "0";
            container.appendChild(canvas);
            style = container.style;
            style.overflow = "hidden";
            style.position = "absolute";
        }

        private playerOption: PlayerOption;

        /**
         * @private
         * 画布实例
         */
        private canvas: HTMLCanvasElement;
        /**
         * @private
         * 播放器容器实例
         */
        private container: HTMLElement;

        /**
         * @private
         * 舞台引用
         */
        public stage: Stage;

        private webTouchHandler: WebTouchHandler;
        private player: Player;
        private webInput: HTMLInput;


        private updateAfterTyping: boolean = false;

        /**
         * @private
         * 更新播放器视口尺寸
         */
        public updateScreenSize(): void {
            let canvas = this.canvas;
            if (canvas['userTyping']) {
                this.updateAfterTyping = true;
                return;
            }
            let option = this.playerOption;
            let screenRect = this.container.getBoundingClientRect();
            let top = 0;
            let boundingClientWidth = screenRect.width;
            let boundingClientHeight = screenRect.height;
            if (boundingClientWidth === 0 || boundingClientHeight === 0) {
                return;
            }
            if (screenRect.top < 0) {
                boundingClientHeight += screenRect.top;
                top = -screenRect.top;
            }
            let shouldRotate = false;

            let orientation: string = this.stage.$orientation;
            if (orientation !== OrientationMode.AUTO) {
                shouldRotate = orientation !== OrientationMode.PORTRAIT && boundingClientHeight > boundingClientWidth
                    || orientation === OrientationMode.PORTRAIT && boundingClientWidth > boundingClientHeight;
            }
            let screenWidth = shouldRotate ? boundingClientHeight : boundingClientWidth;
            let screenHeight = shouldRotate ? boundingClientWidth : boundingClientHeight;
            Capabilities["boundingClientWidth" + ""] = screenWidth;
            Capabilities["boundingClientHeight" + ""] = screenHeight;
            let stageSize = screenAdapter.calculateStageSize(this.stage.$scaleMode,
                screenWidth, screenHeight, option.contentWidth, option.contentHeight);
            let stageWidth = stageSize.stageWidth;
            let stageHeight = stageSize.stageHeight;
            let displayWidth = stageSize.displayWidth;
            let displayHeight = stageSize.displayHeight;
            canvas.style[egret.getPrefixStyleName("transformOrigin")] = "0% 0% 0px";
            if (canvas.width !== stageWidth) {
                canvas.width = stageWidth;
            }
            if (canvas.height !== stageHeight) {
                canvas.height = stageHeight;
            }
            let rotation = 0;
            if (shouldRotate) {
                if (orientation === OrientationMode.LANDSCAPE) {//
                    rotation = 90;
                    canvas.style.top = top + (boundingClientHeight - displayWidth) / 2 + "px";
                    canvas.style.left = (boundingClientWidth + displayHeight) / 2 + "px";
                }
                else {
                    rotation = -90;
                    canvas.style.top = top + (boundingClientHeight + displayWidth) / 2 + "px";
                    canvas.style.left = (boundingClientWidth - displayHeight) / 2 + "px";
                }
            }
            else {
                canvas.style.top = top + (boundingClientHeight - displayHeight) / 2 + "px";
                canvas.style.left = (boundingClientWidth - displayWidth) / 2 + "px";
            }
            let scalex = displayWidth / stageWidth,
                scaley = displayHeight / stageHeight;
            let canvasScaleX = scalex * DisplayList.$canvasScaleFactor;
            let canvasScaleY = scaley * DisplayList.$canvasScaleFactor;
            // if (Capabilities.renderMode == "canvas") {
            canvasScaleX = Math.ceil(canvasScaleX);
            canvasScaleY = Math.ceil(canvasScaleY);
            // }

            let m = Matrix.create();
            m.identity();
            m.scale(scalex / canvasScaleX, scaley / canvasScaleY);
            m.rotate(rotation * Math.PI / 180);
            let transform = `matrix(${m.a},${m.b},${m.c},${m.d},${m.tx},${m.ty})`;
            Matrix.release(m);
            canvas.style[egret.getPrefixStyleName("transform")] = transform;
            DisplayList.$setCanvasScale(canvasScaleX, canvasScaleY);
            this.webTouchHandler.updateScaleMode(scalex, scaley, rotation);
            this.webInput.$updateSize();
            this.player.updateStageSize(stageWidth, stageHeight);//不要在这个方法后面修改属性
            // todo
            if (nativeRender) {
                canvas.width = stageWidth * canvasScaleX;
                canvas.height = stageHeight * canvasScaleY;
            }
        }

        public setContentSize(width: number, height: number): void {
            let option = this.playerOption;
            option.contentWidth = width;
            option.contentHeight = height;
            this.updateScreenSize();
        }

        /**
         * @private
         * 更新触摸数量
         */
        public updateMaxTouches() {
            this.webTouchHandler.$updateMaxTouches();
        }
    }


