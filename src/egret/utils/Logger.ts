// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { DEBUG } from "../../Defines.debug";

    /**
     * Logger is an entrance for the log processing namespace of the engine
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * Logger是引擎的日志处理模块入口
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
    export class Logger {

        /**
         * open all
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 全开
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static ALL:string = "all";

        /**
         * level: DEBUG
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 等级为 DEBUG
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static DEBUG:string = "debug";

        /**
         * level: INFO
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 等级为 INFO
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static INFO:string = "info";

        /**
         * level: WARN
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 等级为 WARN
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static WARN:string = "warn";

        /**
         * level: ERROR
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 等级为 ERROR
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static ERROR:string = "error";

        /**
         * close all
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 全关
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static OFF:string = "off";

        /**
         * Set the current need to open the log level. Grade level are: ALL <DEBUG <INFO <WARN <ERROR <OFF<br/>
         * This feature is only in DEBUG mode to take effect. <br/>
         * <Ul>
         * <Li> Logger.ALL - all levels of log can be printed out. </ li>
         * <Li> Logger.DEBUG - print debug, info, log, warn, error. </ li>
         * <Li> Logger.INFO - print info, log, warn, error. </ li>
         * <Li> Logger.WARN - can print warn, error. </ li>
         * <Li> Logger.ERROR - You can print error. </ li>
         * <Li> Logger.OFF - all closed. </ li>
         * </ Ul>
         *param LogType from this level to start printing.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 设置当前需要开启的log级别。级别等级分别为：ALL < DEBUG < INFO < WARN < ERROR < OFF<br/>
         * 此功能只在 DEBUG 模式下才生效。<br/>
         * <ul>
         * <li>Logger.ALL -- 所有等级的log都可以打印出来。</li>
         * <li>Logger.DEBUG -- 可以打印debug、info、log、warn、error。</li>
         * <li>Logger.INFO -- 可以打印info、log、warn、error。</li>
         * <li>Logger.WARN -- 可以打印warn、error。</li>
         * <li>Logger.ERROR -- 可以打印error。</li>
         * <li>Logger.OFF -- 全部关闭。</li>
         * </ul>
         * @param logType 从这个等级开始打印。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public static set logLevel(logType:string) {
        }
    }