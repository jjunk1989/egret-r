// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { UIComponent } from "./UIComponent";


	/**
	 * The IItemRenderer interface defines the basic set of APIs
	 * that used for List class.
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web
	 * @language en_US
	 */
	/**
	 * 列表类组件的项呈示器接口。
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web
	 * @language zh_CN
	 */
	export interface IItemRenderer extends UIComponent{
		/**
		 * The data to render or edit.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 要呈示或编辑的数据。
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language zh_CN
		 */
		data:any;
		/**
		 * Contains <code>true</code> if the item renderer
		 * can show itself as selected.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 如果项呈示器可以将其自身显示为已选中，则为 true。
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language zh_CN
		 */
		selected:boolean;
		/**
		 * The index of the item in the data provider
		 * of the host component of the item renderer.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 项呈示器的数据提供程序中的项目索引。
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language zh_CN
		 */
		itemIndex:number;
	}