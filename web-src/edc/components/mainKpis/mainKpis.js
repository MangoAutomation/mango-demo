/**
 * Copyright (C) 2020 RadixIot. All rights reserved.
 * @author Jose Puccini
 */

import htmlTemplate from './mainKpis.html';
import './mainKpis.css';

class MainKpisController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['edcSettings', 'maPoint'];
    }

    constructor(edcSettings, maPoint) {
        this.maPoint = maPoint;
        edcSettings.get().then((data) => (this.settings = data));
    }

    $onInit() {}

    $onChanges(changes) {
        if (changes.siteInfo && changes.siteInfo.currentValue) {
            this.getPoints();
        }
    }

    getPoints() {
        this.maPoint
            .buildQuery()
            .eq('tags.site', this.siteInfo.xid)
            .in('tags.equipmentType', [this.equipmentType, 'HVAC'])
            .query()
            .then((points) => {
                this.points = points.reduce((result, point) => {
                    if (point.name === 'PUE') result.pue = point;
                    if (point.name === 'Total Power') result.totalPower = point;
                    if (point.name === 'IT Power') result.itPower = point;
                    if (point.name === 'Mechanical Power') result.mechanicalPower = point;
                    if (point.name === 'Outside Humidity') result.outsideHumidity = point;
                    if (point.name === 'Outside Temperature') result.outsideTemperature = point;

                    return result;
                }, {});
            });
    }
}

export default {
    bindings: {
        siteInfo: '<',
        equipmentType: '@'
    },
    controller: MainKpisController,
    template: htmlTemplate
};
