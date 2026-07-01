// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

    if (DEBUG) {
        let logFuncs:Object;

        function setLogLevel(logType:string):void {
            if (logFuncs == null) {
                logFuncs = {
                    "error": console.error,
                    "debug": console.debug,
                    "warn": console.warn,
                    "info": console.info,
                    "log": console.log
                };
            }
            switch (logType) {
                case Logger.OFF:
                    console.error = function () {
                    };
                case Logger.ERROR:
                    console.warn = function () {
                    };
                case Logger.WARN:
                    console.info = function () {
                    };
                    console.log = function () {
                    };
                case Logger.INFO:
                    console.debug = function () {
                    };
                default :
                    break;
            }

            switch (logType) {
                case Logger.ALL:
                case Logger.DEBUG:
                    console.debug = logFuncs["debug"];
                case Logger.INFO:
                    console.log = logFuncs["log"];
                    console.info = logFuncs["info"];
                case Logger.WARN:
                    console.warn = logFuncs["warn"];
                case Logger.ERROR:
                    console.error = logFuncs["error"];
                default :
                    break;
            }
        }

        Object.defineProperty(Logger, "logLevel", {
            set: setLogLevel,
            enumerable: true,
            configurable: true
        });
    }