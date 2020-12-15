/*
 * Copyright (C) 2020 Infinite Automation Systems Inc. All rights reserved.
 */

import template from './powerPath.html';
import './powerPath.css';

// import circuitBreakerPP from './img/circuitBreakerPP.svg';
import OBBRackPP from './img/OBBRackPP.svg';
import singleRackPP from './img/singleRackPP.svg';

class PowerPathController {
    static get $inject() {
        return ['maPoint'];
    }

    constructor(maPoint) {
        this.maPoint = maPoint;
    }

    $onChanges(changes) {
        if (this.selection && this.selection.row) {
            this.image = this.selection.rack.endsWith('_AR') ? OBBRackPP : singleRackPP;
            this.getPoints();
        } else {
            delete this.pointsArray;
            delete this.points;
        }
    }

    getPoints() {
        const { region, campus, zone, row, subRow, rack } = this.selection;

        this.maPoint
            .buildQuery()
            .eq('tags.region', region)
            .eq('tags.campus', campus)
            .eq('tags.zone', zone)
            .eq('tags.row', row)
            .eq('tags.subRow', subRow)
            .or()
            .eq('tags.equipmentType', 'Busway')
            .and()
            .eq('tags.rack', rack)
            .in('tags.equipmentType', ['Circuit Breaker', 'Rack'])
            .up()
            .up()
            .in('name', ['Load Percentage', 'kW Total'])
            .query()
            .then(
                (points) => {
                    this.updatePointMap(points);
                },
                (error) => {
                    delete this.pointsArray;
                    delete this.points;
                }
            );
    }

    updatePointMap(points) {
        this.pointsArray = points;
        this.points = {};

        const rackPoints = points.filter((p) => p.tags.equipmentType === 'Rack');
        this.points.rack = this.createMap(rackPoints, (p) => p.name);

        for (const [feed, feedPoints] of this.groupBy(points, (p) => p.tags.feed)) {
            const feedMap = (this.points[`feed${feed}`] = {});

            const buswayPoints = feedPoints.filter((p) => p.tags.equipmentType === 'Busway');
            feedMap.busway = this.createMap(buswayPoints, (p) => p.name);

            let i = 0;
            for (const [tapbox, tapboxPoints] of this.groupBy(feedPoints, (p) => p.tags.tapbox)) {
                feedMap[`cb${++i}`] = this.createMap(tapboxPoints, (p) => p.name);
            }
        }
    }

    createMap(array, accessor) {
        return array.reduce((map, item) => {
            const keyValue = accessor(item);
            if (keyValue !== undefined) {
                map[keyValue] = item;
            }
            return map;
        }, {});
    }

    groupBy(array, accessor) {
        return array.reduce((map, item) => {
            const keyValue = accessor(item);
            if (keyValue !== undefined) {
                if (!map.has(keyValue)) map.set(keyValue, []);
                map.get(keyValue).push(item);
            }
            return map;
        }, new Map());
    }

    polygonColor(point) {
        if (point && point.value != null) {
            if (point.value <= 50) {
                return 'dc-alarm-indicator-minor';
            }
            if (point.value > 50 && point.value <= 75) {
                return 'dc-alarm-indicator-information';
            }
            if (point.value > 75 && point.value <= 95) {
                return 'dc-alarm-indicator-warning';
            }
            if (point.value > 95) {
                return 'dc-alarm-indicator-critical';
            }
        }
        return 'dc-alarm-indicator-none';
    }
}

export default {
    template,
    controller: PowerPathController,
    bindings: {
        selection: '<'
    }
};
