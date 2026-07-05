// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

	/**
	 * The IOverride interface is used for view state overrides.
	 * All entries in the State class <code>overrides</code>
	 * property array must implement this interface.
	 *
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web
	 * @language en_US
	 */
	/**
	 * IOverride 接口定义视图状态的覆盖操作。State 类 overrides 属性数组中的所有条目均必须实现此接口。
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web
	 * @language zh_CN
	 */

import { egret } from '@egret-r/core';
const { DisplayObjectContainer } = egret;
	export interface IOverride{
		/**
		 * Applies the override. Retains the original value, so that it can
		 * restore the value later in the <code>remove()</code> method.<p/>
		 *
		 * This method is called automatically when the state is entered.
		 * It should not be called directly.
		 *
		 * @param host A component that contains view states.
		 * @param parent The parent that a sub element be added.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 应用覆盖。将保留原始值，以便以后可以在 remove() 方法中恢复该值。<p/>
		 *
		 * 该方法是当进入状态的时候自动调用的，请不要直接调用此方法。
		 * @param host 含有视图状态的组件。
		 * @param parent 子项添加到的父级容器。
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language zh_CN
		 */
		apply(host:any,parent:DisplayObjectContainer):void;
		/**
		 * Removes the override. The value remembered in the <code>apply()</code>
		 * method is restored. </p>
		 *
		 * This method is called automatically when the state is entered.
		 * It should not be called directly.
		 * @param host A component that contains view states.
		 * @param parent The parent that a sub element be added.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 删除覆盖。在 apply() 方法中记住的值将被恢复。
		 * @param host 含有视图状态的组件。
		 * @param parent 子项添加到的父级容器。
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language zh_CN
		 */
		remove(host:any,parent:DisplayObjectContainer):void;
	}