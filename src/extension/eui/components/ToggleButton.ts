// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.


import { egret } from '@egret-r/core';
const { Event } = egret;
import { Button } from "./Button";
import { registerBindable } from "../utils/registerBindable";
import { PropertyEvent } from "../events/PropertyEvent";

	/**
	 * The ToggleButton component defines a toggle button.
	 * Clicking the button toggles it between the up and an down states.
	 * If you click the button while it is in the up state,
	 * it toggles to the down state. You must click the button again
	 * to toggle it back to the up state.
	 * <p>You can get or set this state programmatically
	 * by using the <code>selected</code> property.</p>
	 *
	 * @event Event.CHANGE Dispatched when the <code>selected</code> property
	 * changes for the ToggleButton control.
	 * This event is dispatched only when the
	 * user interacts with the control by touching.
	 *
	 * @state up Button up state
	 * @state down Button down state
	 * @state disabled Button disabled state
	 * @state upAndSelected Up state when the button is selected
	 * @state downAndSelected Down state when the button is selected
	 * @state disabledAndSelected Disabled state when the button is selected
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web
	 * @includeExample  extension/eui/components/ToggleButtonExample.ts
	 * @language en_US
	 */
	/**
	 * ToggleButton 组件定义切换按钮。单击该按钮会在弹起状态和按下状态之间进行切换。
	 * 如果在按钮处于弹起状态时单击该按钮，则它会切换到按下状态。必须再次单击该按钮才可将其切换回弹起状态。
	 * <p>可以使用 <code>selected</code> 属性以编程方式获取或设置此状态。</p>
	 *
	 * @event Event.CHANGE ToggleButtonBase 控件的 <code>selected</code> 属性更改时分派。
	 * 仅当用户通过触摸与控件交互时，才分派此事件。
	 *
	 * @state up 按钮弹起状态
	 * @state down 按钮按下状态
	 * @state disabled 按钮禁用状态
	 * @state upAndSelected 按钮选择时的弹起状态
	 * @state downAndSelected 按钮选择时的按下状态
	 * @state disabledAndSelected 按钮选择时的禁用状态
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web
	 * @includeExample  extension/eui/components/ToggleButtonExample.ts
	 * @language zh_CN
	 */
	export class ToggleButton extends Button{

		/**
		 * @private
		 */
		$selected: boolean = false;
		/**
		 * Contains <code>true</code> if the button is in the down state,
		 * and <code>false</code> if it is in the up state.
		 *
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 按钮处于按下状态时为 <code>true</code>，而按钮处于弹起状态时为 <code>false</code>。
		 *
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 * @language zh_CN
		 */
		public get selected():boolean{
			return this.$selected;
		}

		public set selected(value:boolean){
			this.$setSelected(value);
		}

		/**
		 * @private
		 * 
		 * @param value 
		 */
		$setSelected(value:boolean):boolean{
			value = !!value;
			if (value === this.$selected)
				return false;
			this.$selected = value;
			this.invalidateState();
			PropertyEvent.dispatchPropertyEvent(this,PropertyEvent.PROPERTY_CHANGE,"selected");
			return true;
		}

		/**
		 * @inheritDoc
		 *
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 */
		protected getCurrentState():string{
			let state = super.getCurrentState();
			if (!this.$selected){
				return state;
			}
			else{
				let selectedState = state + "AndSelected";
				let skin = this.skin;
				if(skin&&skin.hasState(selectedState)){
					return selectedState;
				}
				return state=="disabled"?"disabled":"down";
			}
		}
		/**
		 * @private
		 * 是否根据触摸事件自动变换选中状态,默认true。仅框架内使用。
		 */
		$autoSelected:boolean = true;

		/**
		 * @inheritDoc
		 *
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web
		 */
		protected buttonReleased():void{
			if(!this.$autoSelected)
				return;
			this.selected = !this.$selected;
			this.dispatchEventWith(Event.CHANGE);
		}
	}
	registerBindable(ToggleButton.prototype,"selected");