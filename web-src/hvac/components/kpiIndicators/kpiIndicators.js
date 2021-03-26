/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Luis Güette
 */

import htmlTemplate from './kpiIndicators.html';
import './kpiIndicators.css';

const POINT_KEYS = {
    'Occupied Units': 'occupiedUnits',
    'Max kW/ton': 'maxKwTon',
    'Consumed Energy': 'energy',
};

class KpiIndicatorsController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['maPoint'];
    }

    constructor(Point) {
        this.Point = Point;
    }

    $onInit() {
        this.Point.buildQuery()
            .eq('deviceName', 'HVAC General')
            .limit(1000)
            .query()
            .then((points) => {
                this.points = {};

                points.forEach((point) => {
                    this.points[POINT_KEYS[point.name]] = point;
                });
            });
    }
}

export default {
    bindings: {
        unitsCount: '<',
    },
    controller: KpiIndicatorsController,
    template: htmlTemplate,
};
