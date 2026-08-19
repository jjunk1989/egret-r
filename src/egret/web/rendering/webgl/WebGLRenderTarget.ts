// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { HashObject } from "../../../utils/HashObject";
import { DEBUG } from "../../../../Defines.debug";
import { WebGLRenderContext } from "./WebGLRenderContext";
import { WebGLUtils } from "./WebGLUtils";


    /**
     * @private
     * WebGLRenderTarget 
     * A WebGL render target with a frame buffer and texture
     */
    export class WebGLRenderTarget extends HashObject {

        private gl: WebGLRenderingContext;

        // stores the texture of the rendering results
        public texture: WebGLTexture;

        private frameBuffer: WebGLFramebuffer;

        private stencilBuffer: WebGLRenderbuffer;

        // The size of the render target, same as the texture and stencil buffer
        public width: number;
        public height: number;

        public clearColor = [0, 0, 0, 0];
        /**
         * If frame buffer is enabled, the default is true
         */
        public useFrameBuffer: boolean = true;

        public constructor(gl: WebGLRenderingContext, width: number, height: number) {
            super();
            this.gl = gl;
            this._resize(width, height);
        }

        private _resize(width: number, height: number): void {
            // Chrome alerts if the size is 0
            width = width || 1;
            height = height || 1;
            if (width < 1) {
                if (DEBUG) {
                    egret.warn('WebGLRenderTarget _resize width = ' + width);
                }
                width = 1;
            }
            if (height < 1) {
                if (DEBUG) {
                    egret.warn('WebGLRenderTarget _resize height = ' + height);
                }
                height = 1;
            }
            this.width = width;
            this.height = height;
        }

        public resize(width: number, height: number): void {
            this._resize(width, height);
            let gl = this.gl;
            if (this.frameBuffer) {
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                // gl.bindTexture(gl.TEXTURE_2D, null);
            }
            if (this.stencilBuffer) {
                gl.deleteRenderbuffer(this.stencilBuffer);
                this.stencilBuffer = null;
            }
        }

        public activate(): void {
            let gl = this.gl;
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.getFrameBuffer());
        }

        private getFrameBuffer(): WebGLFramebuffer {
            if (!this.useFrameBuffer) {
                return null;
            }
            return this.frameBuffer;
        }

        public initFrameBuffer(): void {
            if (!this.frameBuffer) {
                let gl = this.gl;
                this.texture = this.createTexture();
                this.frameBuffer = gl.createFramebuffer();
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
            }
        }

        private createTexture(): WebGLTexture {
            //就是创建空的纹理
            const webglrendercontext = WebGLRenderContext.getInstance(0, 0);
            return sys._createTexture(webglrendercontext, this.width, this.height, null);
        }

        public reset(bind?: boolean) {
            let gl = this.gl;
            if (bind) {
                this.activate();
            }
            gl.colorMask(true, true, true, true);
            gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }

        public enabledStencil(): void {
            if (!this.frameBuffer || this.stencilBuffer) {
                return;
            }
            let gl = this.gl;
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
            this.stencilBuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencilBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, this.width, this.height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.stencilBuffer);

            // Is unbundling a bug here?
            // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        public dispose(): void {
            WebGLUtils.deleteWebGLTexture(this.texture);
        }
    }
