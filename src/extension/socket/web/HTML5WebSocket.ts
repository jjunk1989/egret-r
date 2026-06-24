// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret.web {
    /**
     * @private
     */
    export class HTML5WebSocket implements ISocket {
        private socket;

        constructor() {
            if (!window["WebSocket"]) {
                egret.$error(3100);
            }
        }

        private onConnect: Function;
        private onClose: Function;
        private onSocketData: Function;
        private onError: Function;
        private thisObject: any;
        public addCallBacks(onConnect: Function, onClose: Function, onSocketData: Function, onError: Function, thisObject: any): void {
            this.onConnect = onConnect;
            this.onClose = onClose;
            this.onSocketData = onSocketData;
            this.onError = onError;
            this.thisObject = thisObject;
        }

        private host: string = "";
        private port: number = 0;
        public connect(host: string, port?: number): void {
            this.host = host;
            this.port = port;

            let socketServerUrl = WebSocket.URI + this.host + (this.port != null ? ":" + this.port : "");
            this.socket = new window["WebSocket"](socketServerUrl);
            this.socket.binaryType = "arraybuffer";
            this._bindEvent();
        }

        public connectByUrl(url: string): void {
            this.socket = new window["WebSocket"](url);
            this.socket.binaryType = "arraybuffer";
            this._bindEvent();
        }

        private _bindEvent(): void {
            let that = this;
            let socket = this.socket;
            socket.onopen = function () {
                if (that.onConnect) {
                    that.onConnect.call(that.thisObject);
                }
            };
            socket.onclose = function (e) {
                if (that.onClose) {
                    that.onClose.call(that.thisObject);
                }
            };
            socket.onerror = function (e) {
                if (that.onError) {
                    that.onError.call(that.thisObject);
                }
            };
            socket.onmessage = function (e) {
                if (that.onSocketData) {
                    if (e.data) {
                        that.onSocketData.call(that.thisObject, e.data);
                    } else {
                        //for mygame
                        that.onSocketData.call(that.thisObject, e);
                    }
                }
            };
        }

        public send(message: any): void {
            this.socket.send(message);
        }

        public close(): void {
            this.socket.close();
        }
        public disconnect(): void {
            if (this.socket.disconnect) {
                this.socket.disconnect();
            }
        }
    }

    ISocket = HTML5WebSocket;
}
