// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


namespace eui {

	/**
	 * An <code>ICollectionView</code> is a view onto a collection of data.
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web
	 * @language en_US
	 */
	/**
	 *
	 * <code>ICollection</code>是一个列表的集合类数据源对象的查看接口。
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web
	 * @language zh_CN
	 */
	export interface ICollection extends egret.IEventDispatcher{
		/**
		 * The number of items in this view.
		 * 0 means no items, while -1 means that the length is unknown.
         * @readOnly
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 此集合中的项目数。0 表示不包含项目。
         * @readOnly
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language zh_CN
		 */
		length:number;
		/**
		 * Gets the item at the specified index.
		 * @param index The index in the list from which to retrieve the item.
		 * @return The item at that index, or <code>null</code> if there is none.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 获取指定索引处的项目。
		 * @param index 要得到的项的指定位置。
		 * @return 在索引位置的项，如果没有该项则返回null。
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language zh_CN
		 */
		getItemAt(index:number):any;
		/**
		 * Returns the index of the item if it is in the list。-1 otherwise.
		 * @param item The item to find.
		 * @return The index of the item, or -1 if the item is not in the list.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 如果项目位于列表中,返回该项目的索引。否则返回-1。
		 * @param item 要查找的项。
		 * @return 项的索引，如果该项没有在列表中将返回-1.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language zh_CN
		 */
		getItemIndex(item:any):number;
	}
}
