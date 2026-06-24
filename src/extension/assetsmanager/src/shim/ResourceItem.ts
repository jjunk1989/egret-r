// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

module RES {

	/**
	 * Resource term. One of the resources arrays in resource.json.
	 * @version Egret 5.2
	 * @platform Web
	 * @language en_US
	 */
	/**
	 * 资源项。对应 resource.json 中 resources 数组中的一项。
	 * @version Egret 5.2
	 * @platform Web
	 * @language zh_CN
	 */

	export namespace ResourceItem {


		/**
		 * XML file.
		 * @version Egret 5.2
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * XML 文件。
		 * @version Egret 5.2
		 * @platform Web
		 * @language zh_CN
		 */
		export const TYPE_XML: string = "xml";
		/**
		 * Picture file.
		 * @version Egret 5.2
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 图片文件。
		 * @version Egret 5.2
		 * @platform Web
		 * @language zh_CN
		 */
		export const TYPE_IMAGE: string = "image";
		/**
		 * Binary file.
		 * @version Egret 5.2
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 二进制文件。
		 * @version Egret 5.2
		 * @platform Web
		 * @language zh_CN
		 */
		export const TYPE_BIN: string = "bin";
		/**
		 * Text file.
		 * @version Egret 5.2
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 文本文件。
		 * @version Egret 5.2
		 * @platform Web
		 * @language zh_CN
		 */
		export const TYPE_TEXT: string = "text";
		/**
		 * JSON file.
		 * @version Egret 5.2
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * JSON 文件。
		 * @version Egret 5.2
		 * @platform Web
		 * @language zh_CN
		 */
		export const TYPE_JSON: string = "json";
		/**
		 * SpriteSheet file.
		 * @version Egret 5.2
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * SpriteSheet 文件。
		 * @version Egret 5.2
		 * @platform Web
		 * @language zh_CN
		 */
		export const TYPE_SHEET: string = "sheet";
		/**
		 * BitmapTextSpriteSheet file.
		 * @version Egret 5.2
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * BitmapTextSpriteSheet 文件。
		 * @version Egret 5.2
		 * @platform Web
		 * @language zh_CN
		 */
		export const TYPE_FONT: string = "font";
		/**
		 * Sound file.
		 * @version Egret 5.2
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 声音文件。
		 * @version Egret 5.2
		 * @platform Web
		 * @language zh_CN
		 */
		export const TYPE_SOUND: string = "sound";
		/**
		 * TTF file.
		 * @version Egret 5.3
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * TTF字体文件。
		 * @version Egret 5.3
		 * @platform Web
		 * @language zh_CN
		 */
		export const TYPE_TTF: string = "ttf";
		export function convertToResItem(r: ResourceInfo): ResourceItem {

			let name = r.name;
			if (!config.config) {
				name = r.url;
			}
			else {
				for (let aliasName in config.config.alias) {
					if (config.config.alias[aliasName] == r.url) {
						name = aliasName;
					}
				}
			}

			let result = {
				name,
				url: r.url,
				type: r.type,
				data: r,
				root: r.root
			}

			return result;
		}

	}



	export interface ResourceItem extends ResourceInfo {

		/**
		 * Name of resource term.
		 * @version Egret 5.2
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 加载项名称。
		 * @version Egret 5.2
		 * @platform Web
		 * @language zh_CN
		 */
		name: string;
		/**
		 * URL of resource term.
		 * @version Egret 5.2
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 要加载的文件地址。
		 * @version Egret 5.2
		 * @platform Web
		 * @language zh_CN
		 */
		url: string;
		/**
		 * Type of resource term.
		 * @version Egret 5.2
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 加载项文件类型。
		 * @version Egret 5.2
		 * @platform Web
		 * @language zh_CN
		 */
		type: string;

		/**
		 * The raw data object to be referenced.
		 * @version Egret 5.2
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 被引用的原始数据对象。
		 * @version Egret 5.2
		 * @platform Web
		 * @language zh_CN
		 */
		data: ResourceInfo;

		crc32?: string;

		size?: number;

		soundType?: string

	}
}