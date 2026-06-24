// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret.web {
    /**
     * @private 
     */
    export class EgretWebGLUniform {

        private gl:WebGLRenderingContext;

        private name:string;

        public type:WEBGL_UNIFORM_TYPE;

        private size:number;

        private location:WebGLUniformLocation;

        constructor(gl:WebGLRenderingContext, program:WebGLProgram, uniformData:any) {
            this.gl = gl;

            this.name = uniformData.name;

            this.type = uniformData.type;

            this.size = uniformData.size;

            this.location = gl.getUniformLocation(program, this.name);

            this.setDefaultValue();
            this.generateSetValue();
            this.generateUpload();
        }

        public value:any;

        private setDefaultValue():void {
            let type = this.type;

            switch (type) {
                case WEBGL_UNIFORM_TYPE.FLOAT:
                case WEBGL_UNIFORM_TYPE.SAMPLER_2D:
                case WEBGL_UNIFORM_TYPE.SAMPLER_CUBE:
                case WEBGL_UNIFORM_TYPE.BOOL:
                case WEBGL_UNIFORM_TYPE.INT:
                    this.value = 0;
                    break;
                case WEBGL_UNIFORM_TYPE.FLOAT_VEC2:
                case WEBGL_UNIFORM_TYPE.BOOL_VEC2:
                case WEBGL_UNIFORM_TYPE.INT_VEC2:
                    this.value = [0, 0];
                    break;
                case WEBGL_UNIFORM_TYPE.FLOAT_VEC3:
                case WEBGL_UNIFORM_TYPE.BOOL_VEC3:
                case WEBGL_UNIFORM_TYPE.INT_VEC3:
                    this.value = [0, 0, 0];
                    break;
                case WEBGL_UNIFORM_TYPE.FLOAT_VEC4:
                case WEBGL_UNIFORM_TYPE.BOOL_VEC4:
                case WEBGL_UNIFORM_TYPE.INT_VEC4:
                    this.value = [0, 0, 0, 0];
                    break;

                case WEBGL_UNIFORM_TYPE.FLOAT_MAT2:
                    this.value = new Float32Array([
                        1, 0,
                        0, 1
                    ]);
                    break;
                case WEBGL_UNIFORM_TYPE.FLOAT_MAT3:
                    this.value = new Float32Array([
                        1, 0, 0,
                        0, 1, 0,
                        0, 0, 1
                    ]);
                    break;
                case WEBGL_UNIFORM_TYPE.FLOAT_MAT4:
                    this.value = new Float32Array([
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        0, 0, 0, 1
                    ]);
                    break;
            }
        }

        public setValue:Function;

        private generateSetValue():void {
            let type = this.type;

            switch (type) {
                case WEBGL_UNIFORM_TYPE.FLOAT:
                case WEBGL_UNIFORM_TYPE.SAMPLER_2D:
                case WEBGL_UNIFORM_TYPE.SAMPLER_CUBE:
                case WEBGL_UNIFORM_TYPE.BOOL:
                case WEBGL_UNIFORM_TYPE.INT:
                    this.setValue = function(value) {
                        let notEqual = this.value !== value;
                        this.value = value;
                        notEqual && this.upload();
                    }
                    break;
                case WEBGL_UNIFORM_TYPE.FLOAT_VEC2:
                case WEBGL_UNIFORM_TYPE.BOOL_VEC2:
                case WEBGL_UNIFORM_TYPE.INT_VEC2:
                    this.setValue = function(value) {
                        let notEqual = this.value[0] !== value.x || this.value[1] !== value.y;
                        this.value[0] = value.x;
                        this.value[1] = value.y;
                        notEqual && this.upload();
                    }
                    break;
                case WEBGL_UNIFORM_TYPE.FLOAT_VEC3:
                case WEBGL_UNIFORM_TYPE.BOOL_VEC3:
                case WEBGL_UNIFORM_TYPE.INT_VEC3:
                    this.setValue = function(value) {
                        this.value[0] = value.x;
                        this.value[1] = value.y;
                        this.value[2] = value.z;
                        this.upload();
                    }
                    break;
                case WEBGL_UNIFORM_TYPE.FLOAT_VEC4:
                case WEBGL_UNIFORM_TYPE.BOOL_VEC4:
                case WEBGL_UNIFORM_TYPE.INT_VEC4:
                    this.setValue = function(value) {
                        this.value[0] = value.x;
                        this.value[1] = value.y;
                        this.value[2] = value.z;
                        this.value[3] = value.w;
                        this.upload();
                    }
                    break;

                case WEBGL_UNIFORM_TYPE.FLOAT_MAT2:
                case WEBGL_UNIFORM_TYPE.FLOAT_MAT3:
                case WEBGL_UNIFORM_TYPE.FLOAT_MAT4:
                    this.setValue = function(value) {
                        this.value.set(value);
                        this.upload();
                    }
                    break;
            }
        }

        public upload:Function;

        private generateUpload():void {
            let gl = this.gl;
            let type = this.type;
            let location = this.location;

            switch (type) {
                case WEBGL_UNIFORM_TYPE.FLOAT:
                    this.upload = function() {
                        var value = this.value;
                        gl.uniform1f(location, value);
                    };
                    break;
                case WEBGL_UNIFORM_TYPE.FLOAT_VEC2:
                    this.upload = function() {
                        var value = this.value;
                        gl.uniform2f(location, value[0], value[1]);
                    };
                    break;
                case WEBGL_UNIFORM_TYPE.FLOAT_VEC3:
                    this.upload = function() {
                        var value = this.value;
                        gl.uniform3f(location, value[0], value[1], value[2]);
                    };
                    break;
                case WEBGL_UNIFORM_TYPE.FLOAT_VEC4:
                    this.upload = function() {
                        var value = this.value;
                        gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                    };
                    break;

                case WEBGL_UNIFORM_TYPE.SAMPLER_2D:
                case WEBGL_UNIFORM_TYPE.SAMPLER_CUBE:
                case WEBGL_UNIFORM_TYPE.BOOL:
                case WEBGL_UNIFORM_TYPE.INT:
                    this.upload = function() {
                        var value = this.value;
                        gl.uniform1i(location, value);
                    };
                    break;
                case WEBGL_UNIFORM_TYPE.BOOL_VEC2:
                case WEBGL_UNIFORM_TYPE.INT_VEC2:
                    this.upload = function() {
                        var value = this.value;
                        gl.uniform2i(location, value[0], value[1]);
                    };
                    break;
                case WEBGL_UNIFORM_TYPE.BOOL_VEC3:
                case WEBGL_UNIFORM_TYPE.INT_VEC3:
                    this.upload = function() {
                        var value = this.value;
                        gl.uniform3i(location, value[0], value[1], value[2]);
                    };
                    break;
                case WEBGL_UNIFORM_TYPE.BOOL_VEC4:
                case WEBGL_UNIFORM_TYPE.INT_VEC4:
                    this.upload = function() {
                        var value = this.value;
                        gl.uniform4i(location, value[0], value[1], value[2], value[3]);
                    };
                    break;

                case WEBGL_UNIFORM_TYPE.FLOAT_MAT2:
                    this.upload = function() {
                        var value = this.value;
                        gl.uniformMatrix2fv(location, false, value);
                    };
                    break;
                case WEBGL_UNIFORM_TYPE.FLOAT_MAT3:
                    this.upload = function() {
                        var value = this.value;
                        gl.uniformMatrix3fv(location, false, value);
                    };
                    break;
                case WEBGL_UNIFORM_TYPE.FLOAT_MAT4:
                    this.upload = function() {
                        var value = this.value;
                        gl.uniformMatrix4fv(location, false, value);
                    };
                    break;
            }
        }
    }
}
