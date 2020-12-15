/**
 * Copyright (C) 2020 RadixIot. All rights reserved.
 * @author Luis Güette
 */

import template from './displayValues.html';
import './displayValues.css';

const POINTS_MAP = {
    'Active user sessions': 'activeUserSessions',
    'Available upgrades': 'availableUpgrades',
    'Data points': 'dataPoints',
    'Data sources': 'dataSources'
};

class DisplayValuesController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['maPoint'];
    }

    constructor(maPoint) {
        this.maPoint = maPoint;
    }

    $onInit() {
        this.getPoints();
    }

    getPoints() {
        this.maPoint
            .buildQuery()
            .eq('deviceName', 'Mango Internal')
            .query()
            .then(points => {
                this.points = points.reduce((result, point) => {
                    const shortName = POINTS_MAP[point.name];

                    if (shortName) {
                        result[shortName] = point;
                    }

                    return result;
                }, {});

                console.log(this.points);
            });
    }
}

export default {
    bindings: {},
    controller: DisplayValuesController,
    template
};
