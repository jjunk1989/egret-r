// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { Stage } from "../display/Stage";
import { getDefinitionByName } from "../utils/getDefinitionByName";
import { DisplayObject } from "../display/DisplayObject";
import { getTimer } from "../utils/getTimer";
import { setLog, setWarn, setError, setAssert } from "../system/Console";
import { systemRenderer, RenderContext } from "./SystemRenderer";
import { ticker } from "./SystemTicker";
import { HashObject } from "../utils/HashObject";
import { RenderBuffer } from "./RenderBuffer";
import { DisplayList } from "./DisplayList";
import { FPSDisplay } from "./FPSDisplay";
import { $error } from "../../Defines.debug";
import { DEBUG } from "../../Defines.debug";
import { $warn } from "../../Defines.debug";
import { Event } from "../events/Event";


    export let $TempStage: Stage;

    /**
     * @private
     * Egret播放器
     */
    export class Player extends HashObject {

        /**
         * @private
         * 实例化一个播放器对象。
         */
        public constructor(buffer: RenderBuffer, stage: Stage, entryClassName: string) {
            super();
            if (DEBUG && !buffer) {
                $error(1003, "buffer");
            }
            this.entryClassName = entryClassName;
            this.stage = stage;
            this.screenDisplayList = this.createDisplayList(stage, buffer);


            this.showFPS = false;
            this.showLog = false;
            this.stageDisplayList = null;

            if (nativeRender) {
                egret_native.rootWebGLBuffer = buffer;
            }
        }

        /**
         * @private
         */
        private createDisplayList(stage: Stage, buffer: RenderBuffer): DisplayList {
            let displayList = new DisplayList(stage);
            displayList.renderBuffer = buffer;
            stage.$displayList = displayList;
            return displayList;
        }


        /**
         * @private
         */
        private screenDisplayList: DisplayList;
        /**
         * @private
         * 入口类的完整类名
         */
        private entryClassName: string;
        /**
         * @private
         * 舞台引用
         */
        public stage: Stage;
        /**
         * @private
         * 入口类实例
         */
        private root: DisplayObject;

        /**
         * @private
         */
        private isPlaying: boolean = false;

        /**
         * @private
         * 启动播放器
         */
        public start(): void {
            if (this.isPlaying || !this.stage) {
                return;
            }

            $TempStage = $TempStage || this.stage;

            this.isPlaying = true;
            if (!this.root) {
                this.initialize();
            }
            ticker.$addPlayer(this);
        }

        /**
         * @private
         */
        private initialize(): void {
            let rootClass;
            if (this.entryClassName) {
                rootClass = getDefinitionByName(this.entryClassName);
            }
            if (rootClass) {
                let rootContainer: any = new rootClass();
                this.root = rootContainer;
                if (rootContainer instanceof DisplayObject) {
                    this.stage.addChild(rootContainer);
                }
                else {
                    DEBUG && $error(1002, this.entryClassName);
                }
            }
            else {
                DEBUG && $error(1001, this.entryClassName);
            }
        }

        /**
         * @private
         * 停止播放器，停止后将不能重新启动。
         */
        public stop(): void {
            this.pause();
            this.stage = null;
        }

        /**
         * @private
         * 暂停播放器，后续可以通过调用start()重新启动播放器。
         */
        public pause(): void {
            if (!this.isPlaying) {
                return;
            }
            this.isPlaying = false;
            ticker.$removePlayer(this);
        }

        /**
         * @private
         * 渲染屏幕
         */
        $render(triggerByFrame: boolean, costTicker: number): void {
            if (nativeRender) {
                egret_native.updateNativeRender();
                egret_native.nrRender();
                return;
            }

            if (systemRenderer.renderClear) {
                systemRenderer.renderClear();
            }

            let stage = this.stage;
            let t1 = getTimer();
            let drawCalls = stage.$displayList.drawToSurface();
            let t2 = getTimer();
            if (triggerByFrame && this.showFPS) {
                fpsDisplay.update(drawCalls, t2 - t1, costTicker);
            }
        }

        /**
         * @private
         * 更新舞台尺寸
         * @param stageWidth 舞台宽度（以像素为单位）
         * @param stageHeight 舞台高度（以像素为单位）
         */
        public updateStageSize(stageWidth: number, stageHeight: number): void {
            let stage = this.stage;
            stage.$stageWidth = stageWidth;
            stage.$stageHeight = stageHeight;
            if (nativeRender) {
                egret_native.nrResize(stageWidth, stageHeight);
            } else {
                this.screenDisplayList.setClipRect(stageWidth, stageHeight);
                if (this.stageDisplayList) {
                    this.stageDisplayList.setClipRect(stageWidth, stageHeight);
                }
            }
            stage.dispatchEventWith(egret.Event.RESIZE);
        }


        /**
         * @private
         * 显示FPS。
         */
        public displayFPS(showFPS: boolean, showLog: boolean, logFilter: string, styles: Object) {
            showLog = !!showLog;
            if (showLog) {
                setLog(function () {
                    let length = arguments.length;
                    let info = "";
                    for (let i = 0; i < length; i++) {
                        info += arguments[i] + " ";
                    }
                    sys.$logToFPS(info);
                    console.log.apply(console, toArray(arguments));
                });
                setWarn(function () {
                    let length = arguments.length;
                    let info = "";
                    for (let i = 0; i < length; i++) {
                        info += arguments[i] + " ";
                    }
                    sys.$warnToFPS(info);
                    console.warn.apply(console, toArray(arguments));
                });
                setError(function () {
                    let length = arguments.length;
                    let info = "";
                    for (let i = 0; i < length; i++) {
                        info += arguments[i] + " ";
                    }
                    sys.$errorToFPS(info);
                    console.error.apply(console, toArray(arguments));
                });
            }
            this.showFPS = !!showFPS;
            this.showLog = showLog;
            if (!fpsDisplay) {
                fpsDisplay = new FPS(this.stage, showFPS, showLog, logFilter, styles);

                let logLength = logLines.length;
                for (let i = 0; i < logLength; i++) {
                    fpsDisplay.updateInfo(logLines[i]);
                }
                logLines = null;

                let warnLength = warnLines.length;
                for (let i = 0; i < warnLength; i++) {
                    fpsDisplay.updateWarn(warnLines[i]);
                }
                warnLines = null;

                let errorLength = errorLines.length;
                for (let i = 0; i < errorLength; i++) {
                    fpsDisplay.updateError(errorLines[i]);
                }
                errorLines = null;
            }
        }
        /**
         * @private
         */
        private showFPS: boolean;
        /**
         * @private
         */
        private showLog: boolean;
        /**
         * @private
         */
        private stageDisplayList: DisplayList;
    }


    /**
     * @private
     * FPS显示对象
     */
    interface FPS {

        /**
         * 更新FPS信息
         */
        update(drawCalls: number, costRender: number, costTicker: number): void;

        /**
         * 插入一条log信息
         */
        updateInfo(info: string): void;
        /**
         * 插入一条warn信息
         */
        updateWarn(info: string): void;
        /**
         * 插入一条error信息
         */
        updateError(info: string): void;
    }

    declare let FPS: { new(stage: Stage, showFPS: boolean, showLog: boolean, logFilter: string, styles: Object): FPS };

    /**
     * @private
     */
    export let $logToFPS: (info: string) => void;
    /**
     * @private
     */
    export let $warnToFPS: (info: string) => void;
    /**
     * @private
     */
    export let $errorToFPS: (info: string) => void;


    let logLines: string[] = [];
    let warnLines: string[] = [];
    let errorLines: string[] = [];
    let fpsDisplay: FPS;

    $logToFPS = function (info: string): void {
        if (!fpsDisplay) {
            logLines.push(info);
            return;
        }
        fpsDisplay.updateInfo(info);
    };

    $warnToFPS = function (info: string): void {
        if (!fpsDisplay) {
            warnLines.push(info);
            return;
        }
        fpsDisplay.updateWarn(info);
    };

    $errorToFPS = function (info: string): void {
        if (!fpsDisplay) {
            errorLines.push(info);
            return;
        }
        fpsDisplay.updateError(info);
    };

    sys.$logToFPS = $logToFPS;
    sys.$warnToFPS = $warnToFPS;
    sys.$errorToFPS = $errorToFPS;


    class FPSImpl {

        private infoLines = [];
        private totalTime = 0;
        private totalTick = 0;
        private lastTime = 0;
        private drawCalls = 0;
        private costRender = 0;
        private costTicker = 0;
        private _stage: Stage;
        private fpsDisplay: FPSDisplay;
        private filter: any;

        constructor(stage: Stage, private showFPS: boolean, private showLog: boolean, private logFilter: string, private styles?: Object) {
            this.infoLines = [];
            this.totalTime = 0;
            this.totalTick = 0;
            this.lastTime = 0;
            this.drawCalls = 0;
            this.costRender = 0;
            this.costTicker = 0;
            this._stage = stage;
            this.showFPS = showFPS;
            this.showLog = showLog;
            this.logFilter = logFilter;
            this.styles = styles;
            this.fpsDisplay = new FPSDisplay(stage, showFPS, showLog, logFilter, styles);
            let logFilterRegExp: RegExp;
            try {
                logFilterRegExp = logFilter ? new RegExp(logFilter) : null;

            }
            catch (e) {
                log(e);
            }
            this.filter = function (message: string): boolean {
                if (logFilterRegExp)
                    return logFilterRegExp.test(message);
                return !logFilter || message.indexOf(logFilter) == 0;
            }
        }

        update(drawCalls: number, costRender, costTicker) {
            let current = getTimer();
            this.totalTime += current - this.lastTime;
            this.lastTime = current;
            //todo 多Player
            this.totalTick++;
            this.drawCalls += drawCalls;
            this.costRender += costRender;
            this.costTicker += costTicker;
            if (this.totalTime >= 1000) {

                let lastFPS = Math.min(Math.ceil(this.totalTick * 1000 / this.totalTime), ticker.$frameRate);
                let lastDrawCalls = Math.round(this.drawCalls / this.totalTick);
                let lastCostRender = Math.round(this.costRender / this.totalTick);
                let lastCostTicker = Math.round(this.costTicker / this.totalTick);
                this.fpsDisplay.update(
                    {
                        fps: lastFPS,
                        draw: lastDrawCalls,
                        costTicker: lastCostTicker,
                        costRender: lastCostRender
                    }
                )
                this.totalTick = 0;
                this.totalTime = this.totalTime % 1000;
                this.drawCalls = 0;
                this.costRender = 0;
                this.costTicker = 0;
            }
        }

        updateInfo(info: any) {
            if (!info) {
                return;
            }
            if (!this.showLog) {
                return;
            }
            if (!this.filter(info)) {
                return;
            }
            this.fpsDisplay.updateInfo(info);
        }

        updateWarn(info) {
            if (!info) {
                return;
            }
            if (!this.showLog) {
                return;
            }
            if (!this.filter(info)) {
                return;
            }
            if (this.fpsDisplay.updateWarn) {
                this.fpsDisplay.updateWarn(info);
            }
            else {
                this.fpsDisplay.updateInfo("[Warning]" + info);
            }
        }

        updateError(info) {
            if (!info) {
                return;
            }
            if (!this.showLog) {
                return;
            }
            if (!this.filter(info)) {
                return;
            }
            if (this.fpsDisplay.updateError) {
                this.fpsDisplay.updateError(info);
            }
            else {
                this.fpsDisplay.updateInfo("[Error]" + info);
            }
        }
    }

    __global.FPS = FPSImpl;

    function toArray(argument) {
        let args = [];
        for (let i = 0; i < argument.length; i++) {
            args.push(argument[i]);
        }
        return args;
    }

    setWarn(function () {
        console.warn.apply(console, toArray(arguments))
    });
    setError(function () {
        console.error.apply(console, toArray(arguments))
    });
    setAssert(function () {
        console.assert.apply(console, toArray(arguments))
    });
    setLog(function () {
        console.log.apply(console, toArray(arguments));
    });

    export let setRenderMode: (renderMode: string) => void;

        export function setWebGLRenderContext(cls: typeof WebGLRenderContext) { WebGLRenderContext = cls; }
export let WebGLRenderContext: { new(width?: number, height?: number, context?: WebGLRenderingContext): RenderContext };


/**
 * @private
 */
    /**
     * @private
     */
    export var nativeRender: boolean = __global.nativeRender;

    //检测版本是否匹配，不匹配改用非原生加速渲染方式
    if (nativeRender) {
        const nrABIVersion = egret_native.nrABIVersion;
        const nrMinEgretVersion = egret_native.nrMinEgretVersion;
        const requiredNrABIVersion = 5;
        if (nrABIVersion < requiredNrABIVersion) {
            nativeRender = false;
            const msg = "需要升级微端版本到 0.1.14 才可以开启原生渲染加速";
            sys.$warnToFPS(msg);
            warn(msg);
        }
        else if (nrABIVersion > requiredNrABIVersion) {
            nativeRender = false;
            const msg = `需要升级引擎版本到 ${nrMinEgretVersion} 才可以开启原生渲染加速`;
            sys.$warnToFPS(msg);
            warn(msg);
        }
    }
