/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Luis Güette
 */

import htmlTemplate from './map.html';
import './map.css';

import onlineIcon from '../../assets/online-unit.svg';
import offlineIcon from '../../assets/offline-unit.svg';

const DEFAULT_CENTER = {
    lat: 35.618379,
    lon: -78.413052,
};

const DEFAULT_ZOOM = 7;

class MapController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return [];
    }

    constructor() {
        this.onlineIcon = onlineIcon;
        this.offlineIcon = offlineIcon;
    }

    $onInit() {
        if (!this.center) {
            this.center = DEFAULT_CENTER;
        }

        if (!this.zoom) {
            this.zoom = DEFAULT_ZOOM;
        }
    }

    addEventListener(map) {
        map.on('popupclose', (event) => {
            this.selectUnit(null);
        });
    }

    selectUnit(unit) {
        this.onSelectUnit({ unit: unit });
    }
}

export default {
    bindings: {
        center: '<?',
        zoom: '<?',
        options: '<?',
        units: '<',
        onSelectUnit: '&',
    },
    controller: MapController,
    template: htmlTemplate,
};
