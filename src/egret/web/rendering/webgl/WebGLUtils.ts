// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret {
    /**
     * @private
     */
    export class WebGLUtils {
        public static compileProgram(gl: WebGLRenderingContext, vertexSrc: string, fragmentSrc: string): WebGLProgram {
            let fragmentShader: WebGLShader = WebGLUtils.compileFragmentShader(gl, fragmentSrc);
            let vertexShader: WebGLShader = WebGLUtils.compileVertexShader(gl, vertexSrc);

            let shaderProgram: WebGLProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                $warn(1020);
            }
            return shaderProgram;
        }

        public static compileFragmentShader(gl: WebGLRenderingContext, shaderSrc: string): WebGLShader {
            return WebGLUtils._compileShader(gl, shaderSrc, gl.FRAGMENT_SHADER);
        }

        public static compileVertexShader(gl: WebGLRenderingContext, shaderSrc: string): WebGLShader {
            return WebGLUtils._compileShader(gl, shaderSrc, gl.VERTEX_SHADER);
        }

        private static _compileShader(gl: WebGLRenderingContext, shaderSrc: string, shaderType: number): WebGLShader {
            let shader: WebGLShader = gl.createShader(shaderType);
            gl.shaderSource(shader, shaderSrc);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                //egret.info(gl.getShaderInfoLog(shader));
                return null;
            }
            return shader;
        }

        private static canUseWebGL: boolean;

        public static checkCanUseWebGL(): boolean {
            if (WebGLUtils.canUseWebGL == undefined) {
                try {
                    let canvas = document.createElement("canvas");
                    WebGLUtils.canUseWebGL = !!window["WebGLRenderingContext"]
                        && !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
                }
                catch (e) {
                    WebGLUtils.canUseWebGL = false;
                }
            }
            return WebGLUtils.canUseWebGL;
        }

        public static deleteWebGLTexture(webglTexture: WebGLTexture): void {
            if (!webglTexture) {
                return;
            }
            if (webglTexture[engine_default_empty_texture]) {
                if (DEBUG) {
                    //引擎默认的空白纹理，不允许删除
                    console.warn('deleteWebGLTexture:' + engine_default_empty_texture);
                }
                return;
            }
            const gl = webglTexture[glContext] as WebGLRenderingContext;
            if (gl) {
                gl.deleteTexture(webglTexture);
            }
            else {
                if (DEBUG) {
                    console.error('deleteWebGLTexture gl = ' + gl);
                }
            }
            /*old
            if (webglTexture && !webglTexture['engine_default_empty_texture']) {
                const gl = webglTexture['glContext'] as WebGLRenderingContext;//bitmapData.glContext;
                if (gl) {
                    gl.deleteTexture(webglTexture);
                }
                else {
                    console.error('deleteWebGLTexture gl = ' + gl);
                }
            }
            */
        }

        /**
         * inspired by pixi.js
         */
        public static premultiplyTint(tint: number, alpha: number): number {
            if (alpha === 1.0) {
                return (alpha * 255 << 24) + tint;
            }
            if (alpha === 0.0) {
                return 0;
            }
            let R = ((tint >> 16) & 0xFF);
            let G = ((tint >> 8) & 0xFF);
            let B = (tint & 0xFF);
            R = ((R * alpha) + 0.5) | 0;
            G = ((G * alpha) + 0.5) | 0;
            B = ((B * alpha) + 0.5) | 0;
            return (alpha * 255 << 24) + (R << 16) + (G << 8) + B;
        }
    }
}