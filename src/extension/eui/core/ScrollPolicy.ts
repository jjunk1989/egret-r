// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace eui {

	/**
	 * Values for the <code>horizontalCanScroll</code> and
	 * <code>verticalCanScroll</code> properties of the Scroller classes.
	 *
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web
	 * @includeExample  extension/eui/core/ScrollPolicyExample.ts
	 * @language en_US
	 */
	/**
	 * 滚动条显示策略常量。
	 * Scroller 类的 <code>horizontalCanScroll</code> 和 <code>verticalCanScroll</code> 属性的值。
	 *
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web
	 * @includeExample  extension/eui/core/ScrollPolicyExample.ts
	 * @language zh_CN
	 */
	export class ScrollPolicy{
		/**
		 * Show the scrollbar if the children exceed the owner's dimension.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 如果子项超出父级的尺寸，则允许滚动，反之不允许滚动。
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language zh_CN
		 */
		public static AUTO:string = "auto";
		
		/**
		 * Never show the scrollbar.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 从不允许滚动。
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language zh_CN
		 */
		public static OFF:string = "off";

		/**
		 * Always show the scrollbar.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 总是允许滚动。
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language zh_CN
		 */
		public static ON:string = "on";
	}
}