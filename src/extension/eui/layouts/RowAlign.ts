// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace eui {

	/**
	 * The RowAlign class defines the possible values for the
	 * <code>rowAlign</code> property of the TileLayout class.
	 *
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web
	 * @includeExample  extension/eui/layout/RowAlignExample.ts
	 * @language en_US
	 */
	/**
	 * RowAlign 类为 TileLayout 类的 <code>rowAlign</code> 属性定义可能的值。
	 *
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web
	 * @includeExample  extension/eui/layout/RowAlignExample.ts
	 * @language zh_CN
	 */
	export class RowAlign{
		/**
		 * Do not justify the rows.
		 *
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 不进行两端对齐。
		 *
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language zh_CN
		 */
		public static TOP:string = "top";
		/**
		 * Justify the rows by increasing the vertical gap.
		 *
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 通过增大垂直间隙将行两端对齐。
		 *
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language zh_CN
		 */
		public static JUSTIFY_USING_GAP:string = "justifyUsingGap";
		
		/**
		 * Justify the rows by increasing the row height.
		 *
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 通过增大行高度将行两端对齐。
		 *
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language zh_CN
		 */
		public static JUSTIFY_USING_HEIGHT:string = "justifyUsingHeight";
	}
}