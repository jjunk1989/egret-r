
import { setDeviceOrientation } from "../DeviceOrientation";
import { DeviceOrientation as DeviceOrientationInterface } from "../DeviceOrientation";
import { EventDispatcher } from "../../events/EventDispatcher";
import { Event } from "../../events/Event";
import { OrientationEvent } from "../../events/OrientationEvent";


    /**
     * @private
     */
    export class WebDeviceOrientation extends EventDispatcher implements DeviceOrientationInterface {

        /**
         * @private
         * 
         */
        start() {
            window.addEventListener("deviceorientation", this.onChange);
        }

        /**
         * @private
         * 
         */
        stop() {
            window.removeEventListener("deviceorientation", this.onChange);
        }

        /**
         * @private
         */
        protected onChange = (e: DeviceOrientationEvent) => {
            let event = new OrientationEvent(egret.Event.CHANGE);
            event.beta = e.beta;
            event.gamma = e.gamma;
            event.alpha = e.alpha;
            this.dispatchEvent(event);
        }
    }

setDeviceOrientation(WebDeviceOrientation);