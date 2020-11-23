/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Luis Güette
 */

import htmlTemplate from './overview.html';

const POINT_KEYS = {
    'kW/ton': 'kwTon',
    'Occupancy': 'occupancy',
    'Power': 'power',
    'Status': 'status'
}

class OverviewController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['hvacUnit', 'maPoint'];
    }

    constructor(Unit, Point) {
        this.Unit = Unit;
        this.Point = Point;

        this.units = [];
    }

    $onInit() {
        this.getUnits();
    }

    getUnits() {
        this.Unit.list().then(units => {
            this.units = units;
            this.getPoints();
        });
    }

    getPoints() {
        this.Point
            .buildQuery()
            .or()
            .match('deviceName', 'Unit*')
            .limit(1000)
            .query()
            .then(points => {
                this.units.map(unit => {
                    unit.points = this.mapPoints(points.filter(point => {
                        return point.deviceName === unit.name
                    }));

                    return unit;
                });
            });
    }

    mapPoints(points) {
        return points.reduce((result, point) => {
            const shortName = POINT_KEYS[point.name];
            if (Object.keys(POINT_KEYS).includes(point.name)) {
                result[shortName] = point;
            }
            return result;
        }, {});
    }

    onSelectUnit(unit) {
        this.selectedUnit = unit;
    }
}

export default {
    bindings: {},
    controller: OverviewController,
    template: htmlTemplate
};
