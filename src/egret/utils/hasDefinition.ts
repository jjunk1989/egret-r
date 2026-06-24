// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


namespace egret {

     /**
      * Check whether a public definition exists in the specified application domain. The definition can be that of a class, a naming space or a function.
      * @param name {string} Name of the definition.
	  * @returns {boolean} Whether the public definition exists
      * @example
      * egret.hasDefinition("egret.DisplayObject") //return true
      * @version Egret 2.4
      * @platform Web
      * @includeExample egret/utils/hasDefinition.ts
      * @language en_US
      */
     /**
      * 检查指定的应用程序域之内是否存在一个公共定义。该定义可以是一个类、一个命名空间或一个函数的定义。
      * @param name {string} 定义的名称。
	  * @returns {boolean} 公共定义是否存在
      * @example
      * egret.hasDefinition("egret.DisplayObject") //返回 true
      * @version Egret 2.4
      * @platform Web
      * @includeExample egret/utils/hasDefinition.ts
      * @language zh_CN
      */
    export function hasDefinition(name:string):boolean{
        let definition:any = getDefinitionByName(name);
        return definition?true:false;
    }
}