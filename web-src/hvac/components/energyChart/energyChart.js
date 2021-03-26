/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Luis Güette
 */

import htmlTemplate from './energyChart.html';
import './energyChart.css';

const POINT_KEYS = {
    'kW/ton': 'kwTon',
    'Consumed Energy': 'energy',
};

class EnergyChartController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['maPoint', 'maUiDateBar'];
    }

    constructor(Point, DateBar) {
        this.Point = Point;
        this.DateBar = DateBar;
    }

    $onInit() {
        this.Point.buildQuery()
            .eq('deviceName', 'HVAC General')
            .or()
            .eq('name', 'Consumed Energy')
            .eq('name', 'kW/ton')
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
    bindings: {},
    controller: EnergyChartController,
    template: htmlTemplate,
};
