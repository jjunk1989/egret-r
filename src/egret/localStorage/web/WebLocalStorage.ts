// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret.localStorage.web {
    /**
     * @private
     * 
     * @param key 
     * @returns 
     */
    function getItem(key:string):string {
        return window.localStorage.getItem(key);
    }

    /**
     * @private
     * 
     * @param key 
     * @param value 
     * @returns 
     */
    function setItem(key:string, value:string):boolean {
        try{
            window.localStorage.setItem(key, value);
            return true;
        }
        catch(e){
            egret.$warn(1047, key, value);
            return false;
        }
    }

    /**
     * @private
     * 
     * @param key 
     */
    function removeItem(key:string):void {
        window.localStorage.removeItem(key);
    }

    /**
     * @private
     * 
     */
    function clear():void {
        window.localStorage.clear();
    }

    localStorage.getItem = getItem;
    localStorage.setItem = setItem;
    localStorage.removeItem = removeItem;
    localStorage.clear = clear;
}