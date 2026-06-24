// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace eui {

	/**
	 * The ColumnAlign class defines the possible values for the
	 * <code>columnAlign</code> property of the TileLayout class.
	 *
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web
	 * @includeExample  extension/eui/layout/ColumnAlignExample.ts
	 * @language en_US
	 */
	/**
	 * ColumnAlign 类为 TileLayout 类的 <code>columnAlign</code> 属性定义可能的值。
	 *
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web
	 * @includeExample  extension/eui/layout/ColumnAlignExample.ts
	 * @language zh_CN
	 */
	export class ColumnAlign{
		/**
		 * Do not justify the rows.
		 *
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 不将行两端对齐。
		 *
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language zh_CN
		 */
		public static LEFT:string = "left";
		
		/**
		 * Justify the rows by increasing the vertical gap.
		 *
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 通过增大水平间隙将行两端对齐。
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
		public static JUSTIFY_USING_WIDTH:string = "justifyUsingWidth";
	}
}