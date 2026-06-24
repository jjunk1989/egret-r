// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret {
    /**
     * @classdesc 使用 MovieClipDataFactory 类，可以生成 MovieClipData 对象用于创建MovieClip
     * @see http://edn.egret.com/cn/docs/page/596 MovieClip序列帧动画
     * @version Egret 2.4
     * @platform Web
     */
    export class MovieClipDataFactory extends egret.EventDispatcher {
        /**
         * 是否开启缓存
         * @version Egret 2.4
         * @platform Web
         */
        public enableCache:boolean = true;
        /**
         * @private
         */
        $mcDataSet:any;
        /**
         * @private
         */
        $spriteSheet:SpriteSheet;
        /**
         * @private
         */
        $mcDataCache:any = {};

        /**
         * 创建一个 egret.MovieClipDataFactory 对象
         * @param movieClipDataSet {any} MovieClip数据集，该数据集必须由Egret官方工具生成
         * @param texture {Texture} 纹理
         * @version Egret 2.4
         * @platform Web
         */
        constructor(movieClipDataSet?:any, texture?:Texture) {
            super();
            this.$mcDataSet = movieClipDataSet;
            this.setTexture(texture);
        }

        /**
         * 清空缓存
         * @version Egret 2.4
         * @platform Web
         */
        public clearCache():void {
            this.$mcDataCache = {};
        }

        /**
         * 根据名字生成一个MovieClipData实例。可以用于创建MovieClip。
         * @param movieClipName {string} MovieClip名字. 可选参数，默认为"", 相当于取第一个MovieClip数据
         * @returns {MovieClipData} 生成的MovieClipData对象
         * @version Egret 2.4
         * @platform Web
         */
        public generateMovieClipData(movieClipName:string = ""):MovieClipData {
            if (movieClipName == "") {
                if (this.$mcDataSet) {
                    for (movieClipName in this.$mcDataSet.mc) {
                        break;
                    }
                }
            }
            if (movieClipName == "") {
                return null;
            }
            let output:MovieClipData = this.findFromCache(movieClipName, this.$mcDataCache);
            if (!output) {
                output = new MovieClipData();
                this.fillData(movieClipName, output, this.$mcDataCache);
            }
            return output;
        }

        /**
         * @private
         *
         * @param movieClipName
         * @param cache
         * @returns
         */
        private findFromCache(movieClipName:string, cache:any):any {
            if (this.enableCache && cache[movieClipName]) {
                return cache[movieClipName];
            }
            return null;
        }

        /**
         * @private
         *
         * @param movieClipName
         * @param movieClip
         * @param cache
         */
        private fillData(movieClipName:string, movieClip:MovieClipData, cache:any):void {
            if (this.$mcDataSet) {
                let mcData = this.$mcDataSet.mc[movieClipName];
                if (mcData) {
                    movieClip.$init(mcData, this.$mcDataSet.res, this.$spriteSheet);
                    if (this.enableCache) {
                        cache[movieClipName] = movieClip;
                    }
                }
            }
        }

        /**
         * MovieClip数据集
         * @version Egret 2.4
         * @platform Web
         */
        public get mcDataSet():any {
            return this.$mcDataSet;
        }

        public set mcDataSet(value:any) {
            this.$mcDataSet = value;
        }

        /**
         * MovieClip需要使用的纹理图
         */
        public set texture(value:Texture) {
            this.setTexture(value);
        }

        /**
         * 由纹理图生成的精灵表
         * @version Egret 2.4
         * @platform Web
         */
        public get spriteSheet():SpriteSheet {
            return this.$spriteSheet;
        }

        /**
         * @private
         *
         * @param value
         */
        private setTexture(value:Texture):void {
            this.$spriteSheet = value ? new SpriteSheet(value) : null;
        }
    }
}