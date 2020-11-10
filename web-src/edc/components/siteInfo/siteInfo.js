/**
 * Copyright (C) 2020 RadixIot. All rights reserved.
 * @author Luis Güette
 */

import htmlTemplate from './siteInfo.html';
import './siteInfo.css';

const POINT_NAME_MAP = {
    Ping: 'status',
    Latency: 'latency'
};
class SiteInfoController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['maPoint'];
    }

    constructor(maPoint) {
        this.maPoint = maPoint;
    }

    $onChanges(changes) {
        if (changes.siteInfo && changes.siteInfo.currentValue) {
            this.getPoints();
        }
    }

    getPoints() {
        this.maPoint
            .buildQuery()
            .eq('tags.equipmentType', this.equipmentType)
            .eq('tags.site', this.siteInfo.xid)
            .query()
            .then((points) => {
                this.points = this.createPointMap(points);
            });
    }

    createPointMap(array) {
        return array.reduce((result, point) => {
            const shortName = POINT_NAME_MAP[point.name];
            if (Object.keys(POINT_NAME_MAP).includes(point.name)) {
                result[shortName] = point;
            }
            return result;
        }, {});
    }
}

export default {
    bindings: {
        siteInfo: '<',
        equipmentType: '@'
    },
    controller: SiteInfoController,
    template: htmlTemplate
};
