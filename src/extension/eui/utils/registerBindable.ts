// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


    let key = "__bindables__";

    /**
     * Register a property of an instance is can be bound.
     * This method is ususally invoked by Watcher class.
     *
     * @param instance the instance to be registered.
     * @param property the property of specified instance to be registered.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 标记实例的一个属性是可绑定的,此方法通常由 Watcher 类调用。
     *
     * @param instance 要标记的实例
     * @param property 可绑定的属性。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web
     * @language zh_CN
     */
    export function registerBindable(instance:any,property:string):void{
        if (DEBUG) {
            if(!instance){
                $error(1003, "instance");
            }
            if(!property){
                $error(1003, "property");
            }
        }

        if(instance.hasOwnProperty(key)){
            instance[key].push(property);
        }
        else{
            let list = [property];
            if(instance[key]){
                list = instance[key].concat(list);
            }
            instance[key] = list;
        }
    }