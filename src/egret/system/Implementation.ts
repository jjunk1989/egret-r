
    /**
    * @private
    * Shared across packages via sys to avoid per-package duplication.
    */
    if (!sys.$implMap) sys.$implMap = {};
    let implMap: any = sys.$implMap;

    /**
     * Adds an interface-name-to-implementation-class mapping to the registry.
     * @param interfaceName the interface name to register. For example："IAssetAdapter","Theme"
     * @param instance the instance to register.
     * @version Egret 3.2.1
     * @platform Web
     * @language en_US
     */
    /**
     * 注册一个接口实现。
     * @param interfaceName 注入的接口名称。例如："IAssetAdapter","Theme"
     * @param instance 实现此接口的实例。
     * @version Egret 3.2.1
     * @platform Web
     * @language zh_CN
     */
    export function registerImplementation(interfaceName: string, instance: any): void {
        implMap[interfaceName] = instance;
    }

    /**
     * Returns the singleton instance of the implementation class that was registered for the specified interface.
     * This method is usually called by egret framework.
     * @param interfaceName The interface name to identify. For example："IAssetAdapter","Theme"
     * @returns the singleton instance of the implementation class
     * @version Egret 3.2.1
     * @platform Web
     * @language en_US
     */
    /**
     * 获取一个接口实现。此方法通常由框架内部调用。获取项目注入的自定义实现实例。
     * @param interfaceName 要获取的接口名称。例如："IAssetAdapter","Theme"
     * @returns 返回实现此接口的实例。
     * @version Egret 3.2.1
     * @platform Web
     * @language zh_CN
     */
    export function getImplementation(interfaceName: string): any {
        return implMap[interfaceName];
    }