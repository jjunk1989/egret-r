// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

declare namespace egret {

    /**
     * Writes an error message to the console if the assertion is false. If the assertion is true, nothing will happen.
     * @param assertion Any boolean expression. If the assertion is false, the message will get written to the console.
     * @param message the message written to the console
     * @param optionalParams the extra messages written to the console
     * @language en_US
     */
    /**
     * 判断参数assertion是否为true，若为false则抛出异常并且在console输出相应信息，反之什么也不做。
     * @param assertion 一个 boolean 表达式，若结果为false，则抛出错误并输出信息。
     * @param message 要输出到控制台的信息
     * @param optionalParams 要输出到控制台的额外可选信息
     * @language zh_CN
     */
    function assert(assertion?:boolean, message?:string, ...optionalParams:any[]):void;
    /**
     * Writes a warning message to the console.
     * @param message the message written to the console
     * @param optionalParams the extra messages written to the console
     * @language en_US
     */
    /**
     * 输出一个警告信息到控制台。
     * @param message 要输出到控制台的信息
     * @param optionalParams 要输出到控制台的额外信息
     * @language zh_CN
     */
    function warn(message?:any, ...optionalParams:any[]):void;
    /**
     * Writes an error message to the console.
     * @param message the message written to the console
     * @param optionalParams the extra messages written to the console
     * @language en_US
     */
    /**
     * 输出一个错误信息到控制台。
     * @param message 要输出到控制台的信息
     * @param optionalParams 要输出到控制台的额外信息
     * @language zh_CN
     */
    function error(message?:any, ...optionalParams:any[]): void;
    /**
     * Writes an message to the console.
     * @param message the message written to the console
     * @param optionalParams the extra messages written to the console
     * @language en_US
     */
    /**
     * 输出一个日志信息到控制台。
     * @param message 要输出到控制台的信息
     * @param optionalParams 要输出到控制台的额外信息
     * @language zh_CN
     */
    function log(message?:any, ...optionalParams:any[]):void;
}
