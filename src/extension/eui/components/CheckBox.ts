// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


namespace eui {

	/**
	 * The CheckBox component consists of an optional label and a small box
	 * that can contain a check mark or not.<p/>
	 *
	 * When a user clicks a CheckBox component or its associated text,
	 * the CheckBox component sets its <code>selected</code> property
	 * to <code>true</code> for checked, and to <code>false</code> for unchecked.
	 *
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web
     * @includeExample extension/eui/components/CheckboxExample.ts
	 * @language en_US
	 */
	/**
	 * CheckBox 组件包含一个可选标签和一个小方框，该方框内可以包含/不包含复选标记。<p/>
	 * 用户单击 CheckBox 组件或其关联文本时，CheckBox 组件会将其 selected 属性设置为 true（表示选中）或 false（表示取消选中）。
	 *
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web
     * @includeExample extension/eui/components/CheckboxExample.ts
	 * @language zh_CN
	 */
	export class CheckBox extends ToggleButton{
		/**
		 * Constructor.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 创建一个CheckBox
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language zh_CN
		 */
		public constructor(){
			super();
		}
	}

}