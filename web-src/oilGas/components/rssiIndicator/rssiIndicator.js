/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Pier Puccini
 */

import rssiIndicator from './rssiIndicator.html';
import './rssiIndicator.css';

import rssiSvg from '../../assets/rssi.svg';

class rssiIndicatorController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return [];
    }

    constructor() {
        this.rssiSvg = rssiSvg;
    }

    $onInit() {}

    rssiSignalUpdate(rssiValue, level) {
        if (rssiValue != null) {
            const absRssi = rssiValue.value;
            switch (level) {
                case 1:
                    if (absRssi >= 5) {
                        return false;
                    }
                    return true;
                case 2:
                    if (absRssi >= 25) {
                        return false;
                    }
                    return true;
                case 3:
                    if (absRssi >= 50) {
                        return false;
                    }
                    return true;
                case 4:
                    if (absRssi >= 90) {
                        return false;
                    }
                    return true;

                default:
                    return false;
            }
        }
        return false;
    }
}

export default {
    bindings: {
        point: '<'
    },
    controller: rssiIndicatorController,
    template: rssiIndicator
};
