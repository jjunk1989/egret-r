// src/egret/display/Bitmap.ts
var egret;
((egret2) => {
  class Bitmap extends DisplayObject {
    /**
     * Initializes a Bitmap object to refer to the specified Texture object.
     * @param value The Texture object being referenced.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 创建一个引用指定 Texture 实例的 Bitmap 对象
     * @param value 被引用的 Texture 实例
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    constructor(value) {
      super();
      this.$texture = null;
      this.$bitmapData = null;
      this.$bitmapX = 0;
      this.$bitmapY = 0;
      this.$bitmapWidth = 0;
      this.$bitmapHeight = 0;
      this.$offsetX = 0;
      this.$offsetY = 0;
      this.$textureWidth = 0;
      this.$textureHeight = 0;
      this.$sourceWidth = 0;
      this.$sourceHeight = 0;
      this.$smoothing = Bitmap.defaultSmoothing;
      this.$explicitBitmapWidth = NaN;
      this.$explicitBitmapHeight = NaN;
      /**
       * @private
       */
      this.$scale9Grid = null;
      /**
       * @private
       */
      this.$fillMode = "scale";
      this._pixelHitTest = false;
      this.$renderNode = new sys.NormalBitmapNode();
      this.$setTexture(value);
      if (value) {
        this.$renderNode.rotated = value.$rotated;
      }
    }
    createNativeDisplayObject() {
      this.$nativeDisplayObject = new egret_native.NativeDisplayObject(egret_native.NativeObjectType.BITMAP);
    }
    /**
     * @private
     * 显示对象添加到舞台
     */
    $onAddToStage(stage, nestLevel) {
      super.$onAddToStage(stage, nestLevel);
      let texture = this.$texture;
      if (texture && texture.$bitmapData) {
        BitmapData.$addDisplayObject(this, texture.$bitmapData);
      }
    }
    /**
     * @private
     * 显示对象从舞台移除
     */
    $onRemoveFromStage() {
      super.$onRemoveFromStage();
      let texture = this.$texture;
      if (texture) {
        BitmapData.$removeDisplayObject(this, texture.$bitmapData);
      }
    }
    /**
     * The Texture object being referenced.
     * If you pass the constructor of type BitmapData or last set for bitmapData, this value returns null.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 被引用的 Texture 对象。
     * 如果传入构造函数的类型为 BitmapData 或者最后设置的为 bitmapData，则此值返回 null。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    get texture() {
      return this.$texture;
    }
    set texture(value) {
      let self = this;
      self.$setTexture(value);
      if (value && self.$renderNode) {
        self.$renderNode.rotated = value.$rotated;
      }
    }
    /**
     * @private
     */
    $setTexture(value) {
      let self = this;
      let oldTexture = self.$texture;
      if (value == oldTexture) {
        return false;
      }
      self.$texture = value;
      if (value) {
        self.$refreshImageData();
      } else {
        if (oldTexture) {
          BitmapData.$removeDisplayObject(self, oldTexture.$bitmapData);
        }
        self.setImageData(null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        self.$renderDirty = true;
        let p2 = self.$parent;
        if (p2 && !p2.$cacheDirty) {
          p2.$cacheDirty = true;
          p2.$cacheDirtyUp();
        }
        let maskedObject2 = self.$maskedObject;
        if (maskedObject2 && !maskedObject2.$cacheDirty) {
          maskedObject2.$cacheDirty = true;
          maskedObject2.$cacheDirtyUp();
        }
        if (egret2.nativeRender) {
          this.setBitmapDataToWasm(null);
        }
        return true;
      }
      if (self.$stage) {
        if (oldTexture && oldTexture.$bitmapData) {
          let oldHashCode = oldTexture.$bitmapData.hashCode;
          let newHashCode = value.$bitmapData ? value.$bitmapData.hashCode : -1;
          if (oldHashCode == newHashCode) {
            self.$renderDirty = true;
            let p2 = self.$parent;
            if (p2 && !p2.$cacheDirty) {
              p2.$cacheDirty = true;
              p2.$cacheDirtyUp();
            }
            let maskedObject2 = self.$maskedObject;
            if (maskedObject2 && !maskedObject2.$cacheDirty) {
              maskedObject2.$cacheDirty = true;
              maskedObject2.$cacheDirtyUp();
            }
            return true;
          }
          BitmapData.$removeDisplayObject(self, oldTexture.$bitmapData);
        }
        BitmapData.$addDisplayObject(self, value.$bitmapData);
      }
      self.$renderDirty = true;
      let p = self.$parent;
      if (p && !p.$cacheDirty) {
        p.$cacheDirty = true;
        p.$cacheDirtyUp();
      }
      let maskedObject = self.$maskedObject;
      if (maskedObject && !maskedObject.$cacheDirty) {
        maskedObject.$cacheDirty = true;
        maskedObject.$cacheDirtyUp();
      }
      return true;
    }
    $setBitmapData(value) {
      this.$setTexture(value);
    }
    /**
     * @private
     */
    setBitmapDataToWasm(data) {
      this.$nativeDisplayObject.setTexture(data);
    }
    /**
     * @private
     */
    $refreshImageData() {
      let texture = this.$texture;
      if (texture) {
        if (egret2.nativeRender) {
          this.setBitmapDataToWasm(texture);
        }
        this.setImageData(
          texture.$bitmapData,
          texture.$bitmapX,
          texture.$bitmapY,
          texture.$bitmapWidth,
          texture.$bitmapHeight,
          texture.$offsetX,
          texture.$offsetY,
          texture.$getTextureWidth(),
          texture.$getTextureHeight(),
          texture.$sourceWidth,
          texture.$sourceHeight
        );
      } else {
        if (egret2.nativeRender) {
          this.setBitmapDataToWasm(null);
        }
      }
    }
    /**
     * @private
     */
    setImageData(bitmapData, bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, textureWidth, textureHeight, sourceWidth, sourceHeight) {
      this.$bitmapData = bitmapData;
      this.$bitmapX = bitmapX;
      this.$bitmapY = bitmapY;
      this.$bitmapWidth = bitmapWidth;
      this.$bitmapHeight = bitmapHeight;
      this.$offsetX = offsetX;
      this.$offsetY = offsetY;
      this.$textureWidth = textureWidth;
      this.$textureHeight = textureHeight;
      this.$sourceWidth = sourceWidth;
      this.$sourceHeight = sourceHeight;
    }
    /**
     * Represent a Rectangle Area that the 9 scale area of Image.
     * Notice: This property is valid only when <code>fillMode</code>
     * is <code>BitmapFillMode.SCALE</code>.
     *
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 矩形区域，它定义素材对象的九个缩放区域。
     * 注意:此属性仅在<code>fillMode</code>为<code>BitmapFillMode.SCALE</code>时有效。
     *
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    get scale9Grid() {
      return this.$scale9Grid;
    }
    set scale9Grid(value) {
      this.$setScale9Grid(value);
    }
    $setScale9Grid(value) {
      let self = this;
      self.$scale9Grid = value;
      self.$renderDirty = true;
      if (egret2.nativeRender) {
        if (value) {
          self.$nativeDisplayObject.setScale9Grid(value.x, value.y, value.width, value.height);
        } else {
          self.$nativeDisplayObject.setScale9Grid(0, 0, -1, -1);
        }
      } else {
        let p = self.$parent;
        if (p && !p.$cacheDirty) {
          p.$cacheDirty = true;
          p.$cacheDirtyUp();
        }
        let maskedObject = self.$maskedObject;
        if (maskedObject && !maskedObject.$cacheDirty) {
          maskedObject.$cacheDirty = true;
          maskedObject.$cacheDirtyUp();
        }
      }
    }
    /**
     * Determines how the bitmap fills in the dimensions.
     * <p>When set to <code>BitmapFillMode.REPEAT</code>, the bitmap
     * repeats to fill the region.</p>
     * <p>When set to <code>BitmapFillMode.SCALE</code>, the bitmap
     * stretches to fill the region.</p>
     *
     * @default <code>BitmapFillMode.SCALE</code>
     *
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * 确定位图填充尺寸的方式。
     * <p>设置为 <code>BitmapFillMode.REPEAT</code>时，位图将重复以填充区域。</p>
     * <p>设置为 <code>BitmapFillMode.SCALE</code>时，位图将拉伸以填充区域。</p>
     *
     * @default <code>BitmapFillMode.SCALE</code>
     *
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
    get fillMode() {
      return this.$fillMode;
    }
    set fillMode(value) {
      this.$setFillMode(value);
    }
    $setFillMode(value) {
      const self = this;
      if (value == self.$fillMode) {
        return false;
      }
      self.$fillMode = value;
      if (egret2.nativeRender) {
        self.$nativeDisplayObject.setBitmapFillMode(self.$fillMode);
      } else {
        self.$renderDirty = true;
        let p = self.$parent;
        if (p && !p.$cacheDirty) {
          p.$cacheDirty = true;
          p.$cacheDirtyUp();
        }
        let maskedObject = self.$maskedObject;
        if (maskedObject && !maskedObject.$cacheDirty) {
          maskedObject.$cacheDirty = true;
          maskedObject.$cacheDirtyUp();
        }
      }
      return true;
    }
    static {
      /**
       * The default value of whether or not is smoothed when scaled.
       * When object such as Bitmap is created,smoothing property will be set to this value.
       * @default true。
       * @version Egret 3.0
       * @platform Web
       * @language en_US
       */
      /**
       * 控制在缩放时是否进行平滑处理的默认值。
       * 在 Bitmap 等对象创建时,smoothing 属性会被设置为该值。
       * @default true。
       * @version Egret 3.0
       * @platform Web
       * @language zh_CN
       */
      this.defaultSmoothing = true;
    }
    /**
     * Whether or not the bitmap is smoothed when scaled.
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * 控制在缩放时是否对位图进行平滑处理。
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
    get smoothing() {
      return this.$smoothing;
    }
    set smoothing(value) {
      let self = this;
      if (value == this.$smoothing) {
        return;
      }
      this.$smoothing = value;
      this.$renderNode.smoothing = value;
      if (!egret2.nativeRender) {
        let p = self.$parent;
        if (p && !p.$cacheDirty) {
          p.$cacheDirty = true;
          p.$cacheDirtyUp();
        }
        let maskedObject = self.$maskedObject;
        if (maskedObject && !maskedObject.$cacheDirty) {
          maskedObject.$cacheDirty = true;
          maskedObject.$cacheDirtyUp();
        }
      } else if (self.$nativeDisplayObject.setSmoothing) {
        self.$nativeDisplayObject.setSmoothing(value);
      }
    }
    /**
     * @private
     *
     * @param value
     */
    $setWidth(value) {
      let self = this;
      if (value < 0 || value == self.$explicitBitmapWidth) {
        return false;
      }
      self.$explicitBitmapWidth = value;
      self.$renderDirty = true;
      if (egret2.nativeRender) {
        self.$nativeDisplayObject.setWidth(value);
      } else {
        let p = self.$parent;
        if (p && !p.$cacheDirty) {
          p.$cacheDirty = true;
          p.$cacheDirtyUp();
        }
        let maskedObject = self.$maskedObject;
        if (maskedObject && !maskedObject.$cacheDirty) {
          maskedObject.$cacheDirty = true;
          maskedObject.$cacheDirtyUp();
        }
      }
      return true;
    }
    /**
     * @private
     *
     * @param value
     */
    $setHeight(value) {
      let self = this;
      if (value < 0 || value == self.$explicitBitmapHeight) {
        return false;
      }
      self.$explicitBitmapHeight = value;
      self.$renderDirty = true;
      if (egret2.nativeRender) {
        self.$nativeDisplayObject.setHeight(value);
      } else {
        let p = self.$parent;
        if (p && !p.$cacheDirty) {
          p.$cacheDirty = true;
          p.$cacheDirtyUp();
        }
        let maskedObject = self.$maskedObject;
        if (maskedObject && !maskedObject.$cacheDirty) {
          maskedObject.$cacheDirty = true;
          maskedObject.$cacheDirtyUp();
        }
      }
      return true;
    }
    /**
     * @private
     * 获取显示宽度
     */
    $getWidth() {
      return isNaN(this.$explicitBitmapWidth) ? this.$getContentBounds().width : this.$explicitBitmapWidth;
    }
    /**
     * @private
     * 获取显示宽度
     */
    $getHeight() {
      return isNaN(this.$explicitBitmapHeight) ? this.$getContentBounds().height : this.$explicitBitmapHeight;
    }
    /**
     * @private
     */
    $measureContentBounds(bounds) {
      if (this.$bitmapData) {
        let w = !isNaN(this.$explicitBitmapWidth) ? this.$explicitBitmapWidth : this.$textureWidth;
        let h = !isNaN(this.$explicitBitmapHeight) ? this.$explicitBitmapHeight : this.$textureHeight;
        bounds.setTo(0, 0, w, h);
      } else {
        let w = !isNaN(this.$explicitBitmapWidth) ? this.$explicitBitmapWidth : 0;
        let h = !isNaN(this.$explicitBitmapHeight) ? this.$explicitBitmapHeight : 0;
        bounds.setTo(0, 0, w, h);
      }
    }
    /**
     * @private
     */
    $updateRenderNode() {
      if (this.$texture) {
        let destW = !isNaN(this.$explicitBitmapWidth) ? this.$explicitBitmapWidth : this.$textureWidth;
        let destH = !isNaN(this.$explicitBitmapHeight) ? this.$explicitBitmapHeight : this.$textureHeight;
        let scale9Grid = this.scale9Grid || this.$texture["scale9Grid"];
        if (scale9Grid) {
          if (this.$renderNode instanceof sys.NormalBitmapNode) {
            this.$renderNode = new sys.BitmapNode();
          }
          sys.BitmapNode.$updateTextureDataWithScale9Grid(
            this.$renderNode,
            this.$bitmapData,
            scale9Grid,
            this.$bitmapX,
            this.$bitmapY,
            this.$bitmapWidth,
            this.$bitmapHeight,
            this.$offsetX,
            this.$offsetY,
            this.$textureWidth,
            this.$textureHeight,
            destW,
            destH,
            this.$sourceWidth,
            this.$sourceHeight,
            this.$smoothing
          );
        } else {
          if (this.fillMode == egret2.BitmapFillMode.REPEAT && this.$renderNode instanceof sys.NormalBitmapNode) {
            this.$renderNode = new sys.BitmapNode();
          }
          sys.BitmapNode.$updateTextureData(
            this.$renderNode,
            this.$bitmapData,
            this.$bitmapX,
            this.$bitmapY,
            this.$bitmapWidth,
            this.$bitmapHeight,
            this.$offsetX,
            this.$offsetY,
            this.$textureWidth,
            this.$textureHeight,
            destW,
            destH,
            this.$sourceWidth,
            this.$sourceHeight,
            this.$fillMode,
            this.$smoothing
          );
        }
      }
    }
    /**
     * Specifies whether this object use precise hit testing by checking the alpha value of each pixel.If pixelHitTest
     * is set to true,the transparent area of the bitmap will be touched through.<br/>
     * Note:If the image is loaded from cross origin,that we can't access to the pixel data,so it might cause
     * the pixelHitTest property invalid.
     * @default false
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 是否开启精确像素碰撞。设置为true显示对象本身的透明区域将能够被穿透。<br/>
     * 注意：若图片资源是以跨域方式从外部服务器加载的，将无法访问图片的像素数据，而导致此属性失效。
     * @default false
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    get pixelHitTest() {
      return this._pixelHitTest;
    }
    set pixelHitTest(value) {
      this._pixelHitTest = !!value;
    }
    $hitTest(stageX, stageY) {
      let target = super.$hitTest(stageX, stageY);
      if (target && this._pixelHitTest) {
        let boo = this.hitTestPoint(stageX, stageY, true);
        if (!boo) {
          target = null;
        }
      }
      return target;
    }
  }
  egret2.Bitmap = Bitmap;
})(egret || (egret = {}));
