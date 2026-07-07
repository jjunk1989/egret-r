/**
 * Type declarations for WeChat Mini Game runtime globals.
 * @see https://developers.weixin.qq.com/minigame/dev/api/
 */
declare const wx: {
  createCanvas(): any;
  getSystemInfoSync(): {
    screenWidth: number;
    screenHeight: number;
    pixelRatio: number;
    platform: string;
    version: string;
    SDKVersion: string;
    model: string;
    deviceOrientation: string;
  };
  onTouchStart(cb: (e: any) => void): void;
  onTouchMove(cb: (e: any) => void): void;
  onTouchEnd(cb: (e: any) => void): void;
  onTouchCancel(cb: (e: any) => void): void;
  onShow(cb: () => void): void;
  onHide(cb: () => void): void;
  createInnerAudioContext(): any;
  createImage(): any;
  request(options: any): any;
  getStorageSync(key: string): any;
  setStorageSync(key: string, value: any): void;
  removeStorageSync(key: string): void;
  requestAnimationFrame(cb: () => void): number;
  cancelAnimationFrame(id: number): void;
  getLogManager(): any;
  env: { USER_DATA_PATH: string };
  getFileSystemManager(): any;
};
