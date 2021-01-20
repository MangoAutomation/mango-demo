/**
 * @copyright 2020 {@link http://Radixiot.com|Radix IOT,LLC.} All rights reserved.
 * @author Luis Güette
 */

import template from './dataHallFloorPlan.html';
import './dataHallFloorPlan.css';
import floorPlanSvg from './assets/dataHallFloorPlan.svg';
import floorPlanBackground from './assets/dataHallFloorPlanBackground.png';
import tooltipTemplate from './tooltip.html';

class DataHallFloorPlanController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['dcUtil', '$scope', '$element', '$compile'];
    }

    constructor(dcUtil, $scope, $element, $compile) {
        this.dcUtil = dcUtil;
        this.$scope = $scope;
        this.$element = $element;
        this.$compile = $compile;

        this.floorPlanSvg = floorPlanSvg;
        this.floorPlanBackground = floorPlanBackground;
    }

    $onInit() {
        this.createTooltip();
    }

    createTooltip() {
        this.$compile(tooltipTemplate)(this.$scope.$new(), ($element, $scope) => {
            $element.css('visibility', 'hidden');
            $element.addClass('dc-rack-tooltip');
            this.$element.append($element);
            this.tooltipElement = $element;
            this.tooltipScope = $scope;
        });
    }

    polygonColor(details) {
        if (details == null) {
            return null;
        }

        const { row, rack } = details;
        const point = this.findPointByRack(row, rack);

        if (point && point.value) {
            if (point.value < 5) {
                return 'dc-alarm-indicator-information';
            }
            if (point.value > 5 && point.value <= 10) {
                return 'dc-alarm-indicator-important';
            }
            if (point.value > 10 && point.value <= 16) {
                return 'dc-alarm-indicator-warning';
            }
            if (point.value > 16) {
                return 'dc-alarm-indicator-critical';
            }
        }
        return 'dc-alarm-indicator-none';
    }

    rackAndRowForPolygon(polygon) {
        const id = polygon.parentNode.id;

        const matches = id.split('-');
        if (matches.length === 3 || matches.length === 4) {
            const [type, row, rack] = matches;
            return { type, row, rack };
        }
    }

    findPointByRack(row, rack) {
        return this.points.find(p => p.tags.row === row && p.tags.rack === rack);
    }

    showTooltip(event) {
        const { row, rack } = this.rackAndRowForPolygon(event.target);
        const loadPoint = this.findPointByRack(row, rack);

        Object.assign(this.tooltipScope, {
            $rack: rack,
            $row: row,
            $loadPoint: loadPoint
        });
        const elementRect = this.$element[0].getBoundingClientRect();
        const targetRect = event.target.getBoundingClientRect();
        const x = targetRect.x - elementRect.x + targetRect.width + 5;
        const y = targetRect.y - elementRect.y + 100;

        this.tooltipElement.css('transform', `translate(${x}px, ${y}px)`);
        this.tooltipElement.css('visibility', 'visible');
    }

    hideTooltip() {
        this.tooltipElement.css('visibility', 'hidden');
    }
}


export default {
    bindings: {
        dataHall: '<',
        points: '<'
    },
    controller: DataHallFloorPlanController,
    template: template
};
