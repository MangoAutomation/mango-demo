/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jose Puccini
 */

import template from './zonesSvg.html';
import tooltipTemplate from './tooltip.html';
import './zonesSvg.css';

import floorPlanZonePH2Svg from './img/zone.svg';
import floorPlanZonePH2Png from './img/zone.png';
import floorPHX2Temp from './img/phx2Temp.svg';

// DCA8
import floorPlanZoneDCA8Svg from './img/dca8.svg';
import floorPlanZoneDCA8Png from './img/dca8.png';

// const ZONES = { PHX2: { rackCount: 16, rowCount: 2 }, PHX3: { rackCount: 16, rowCount: 2 }, PHX4: { rackCount: 16, rowCount: 2 }, DCA8: { rackCount: 8, rowCount: 4 } };

class ZonesSvgController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['$scope', '$element', '$compile'];
    }

    constructor($scope, $element, $compile) {
        this.$scope = $scope;
        this.$element = $element;
        this.$compile = $compile;
    }

    $onInit() {
        this.createTooltip();
        this.opacitySvg = true;
    }

    $onChanges(changes) {
        if (changes.points || changes.displayOption || changes.displayOptionEnvironment || changes.tempLevel || changes.busway) {
            switch (this.points[0].tags.zone) {
                case 'DCA8':
                    this.floorPlanZonePng = floorPlanZoneDCA8Png;
                    this.floorPlanZoneSvg = floorPlanZoneDCA8Svg;
                    break;
                default:
                    this.floorPlanZonePng = floorPlanZonePH2Png;
                    this.floorPlanZoneSvg = floorPlanZonePH2Svg;
                    break;
            }

            if (this.displayOption === 'environmental') {
                switch (this.points[0].tags.zone) {
                    case 'DCA8':
                        break;
                    default:
                        this.floorPlanZoneSvg = floorPHX2Temp;
                        break;
                }
            }

            this.buildPointsMap();
        }
    }

    buildPointsMap() {
        this.pointsByRack = {};
        this.pointsBySubRow = {};
        this.pointsByRowColor = {};
        this.pointsByRowValue = {};

        if (Array.isArray(this.points)) {
            if (this.displayOption === 'rowLoad' || this.displayOption === 'racksLoads') {
                const rackPoints = this.points.filter((p) => p.name === 'Load Percentage' && p.tags.equipmentType === 'Rack');
                const subRowPoints = this.points.filter((p) => p.name === 'Load Percentage' && p.tags.equipmentType === 'Sub Row');
                for (const p of rackPoints) {
                    this.pointsByRack[`${p.tags.row}-${p.tags.rack}`] = p;
                }
                for (const p of subRowPoints) {
                    this.pointsBySubRow[`${p.tags.row}-${p.tags.subRow}`] = p;
                }
            } else if (this.displayOption === 'TAPSumRatios') {
                const subRowPoints = this.points.filter((p) => p.name.trim() === 'kW Total TAPSum ratio' && p.tags.equipmentType === 'Busway' && p.tags.feed === this.busway);
                for (const p of subRowPoints) {
                    this.pointsBySubRow[`${p.tags.row}-${p.tags.subRow}`] = p;
                }
            } else {
                let envPlacement = 'Room';
                let equipmentType = 'Temperature';
                this.aisle = 'room';
                if (this.displayOptionEnvironment === 'roomHumidity') {
                    equipmentType = 'Humidity';
                    envPlacement = 'Room';
                } else if (this.displayOptionEnvironment === 'coldAisleTemperatures') {
                    envPlacement = 'Cold Aisle';
                    this.aisle = 'coldAisle';
                } else if (this.displayOptionEnvironment === 'hotAisleTemperatures') {
                    envPlacement = 'Hot Aisle';
                    this.aisle = 'hotAisle';
                }

                const envPoints = this.points.filter((p) => {
                    const equipmentTypeMatch = p.tags.equipmentType === equipmentType;
                    const envPlacementMatch = p.tags.envPlacement === envPlacement;
                    const envPositionMatch = p.tags.envPosition === this.tempLevel;

                    if (envPlacement === 'Cold Aisle') {
                        return equipmentTypeMatch && envPlacementMatch && envPositionMatch;
                    }
                    return equipmentTypeMatch && envPlacementMatch;
                });
                for (const p of envPoints) {
                    this.pointsByRowColor[`${this.aisle}-Bg-${p.tags.row}-${p.tags.rack}`] = p;
                    this.pointsByRowValue[`${this.aisle}-Value-${p.tags.row}-${p.tags.rack}`] = p;
                }
            }
        }
    }

    polygonColor(details) {
        if (details == null) {
            return null;
        }
        if (this.displayOption !== 'environmental') {
            const { row, rack, subRow } = details;

            if (this.displayOption === 'racksLoads') {
                const point = this.pointsByRack[`${row}-${rack}`];
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
            } else if (this.displayOption === 'rowLoad') {
                const point = this.pointsBySubRow[`${row}-${subRow}`];
                if (point && point.value != null) {
                    if (point.value <= 25) {
                        return 'dc-alarm-indicator-minor';
                    }
                    if (point.value > 25 && point.value <= 35) {
                        return 'dc-alarm-indicator-information';
                    }
                    if (point.value > 35 && point.value <= 42) {
                        return 'dc-alarm-indicator-warning';
                    }
                    if (point.value > 42) {
                        return 'dc-alarm-indicator-critical';
                    }
                }
            } else {
                const point = this.pointsBySubRow[`${row}-${subRow}`];
                if (point && point.value != null) {
                    if (point.value <= 1.02) {
                        return 'dc-alarm-indicator-minor';
                    }
                    if (point.value > 1.02 && point.value <= 1.06) {
                        return 'dc-alarm-indicator-information';
                    }
                    if (point.value > 1.06 && point.value <= 1.1) {
                        return 'dc-alarm-indicator-warning';
                    }
                    if (point.value > 1.1) {
                        return 'dc-alarm-indicator-critical';
                    }
                }
            }
            return 'dc-alarm-indicator-none';
        }
        if (this.displayOption === 'environmental') {
            const { aisle, type, row, rack } = details;
            const pointColor = this.pointsByRowColor[`${aisle}-Bg-${row}-${rack}`];
            if (type === 'Bg') {
                if (pointColor && pointColor.value != null) {
                    if (this.displayOptionEnvironment !== 'roomHumidity') {
                        if (pointColor.value <= 65) {
                            return 'dc-temp-important';
                        }
                        if (pointColor.value > 65 && pointColor.value <= 75) {
                            return 'dc-temp-information';
                        }
                        if (pointColor.value > 75 && pointColor.value <= 80) {
                            return 'dc-temp-warning';
                        }
                        if (pointColor.value > 80) {
                            return 'dc-temp-critical';
                        }
                    } else {
                        if (pointColor.value < 20) {
                            return 'dc-temp-critical';
                        }
                        if (pointColor.value > 80) {
                            return 'dc-temp-critical';
                        }

                        if (pointColor.value < 25 && pointColor.value > 75) {
                            return 'dc-temp-warning';
                        }
                        if (pointColor.value > 25 && pointColor.value < 75) {
                            return 'dc-temp-information';
                        }
                    }

                    return 'dc-temp-none-hide-value';
                }
            } else {
                this.temperaturePoint = this.pointsByRowValue[`${aisle}-Value-${row}-${rack}`];
            }
        }
        // This return is added because of styling error consistent-return
        return null;
    }

    rackAndRowForPolygon(polygon) {
        const id = polygon.parentNode.id;
        const matches = id.split('-');
        if (this.displayOption !== 'environmental') {
            if (matches.length === 3) {
                const [type, row, rackOrSubrow] = matches;
                const arrSubRow = rackOrSubrow.split('*');

                if (type === 'row') {
                    return {
                        type,
                        row,
                        subRow: arrSubRow[0]
                    };
                }
                return {
                    type,
                    row,
                    rack: arrSubRow[0],
                    subRow: arrSubRow[1]
                };
            }
        } else if (this.displayOption === 'environmental') {
            if (matches.length === 4) {
                const [aisle, type, row, rack] = matches;
                return {
                    aisle,
                    type,
                    row,
                    rack
                };
            }
        }
    }

    createTooltip() {
        this.$compile(tooltipTemplate)(this.$scope.$new(), ($element, $scope) => {
            $element.css('visibility', 'hidden');
            $element.addClass('dc-zone-tooltip');
            this.$element.append($element);
            this.tooltipElement = $element;
            this.tooltipScope = $scope;
        });
    }

    showTooltip(event) {
        const { row, rack, subRow } = this.rackAndRowForPolygon(event.target);
        let loadPoint = null;
        if (this.displayOption === 'racksLoads') {
            loadPoint = this.pointsByRack[`${row}-${rack}`];
        } else if (this.displayOption === 'rowLoad' || this.displayOption === 'TAPSumRatios') {
            loadPoint = this.pointsBySubRow[`${row}-${subRow}`];
        } else {
            const { aisle, type, row, rack } = this.rackAndRowForPolygon(event.target);
            loadPoint = this.pointsByRowValue[`${aisle}-Value-${row}-${rack}`];
        }

        Object.assign(this.tooltipScope, {
            $rack: rack,
            $row: row,
            $subRow: subRow,
            $loadPoint: loadPoint
        });
        const elementRect = this.$element[0].getBoundingClientRect();
        const targetRect = event.target.getBoundingClientRect();
        const x = targetRect.x - elementRect.x + targetRect.width + 5;
        const y = targetRect.y - elementRect.y;

        this.tooltipElement.css('transform', `translate(${x}px, ${y}px)`);
        this.tooltipElement.css('visibility', 'visible');
    }

    hideTooltip(event) {
        this.tooltipElement.css('visibility', 'hidden');
    }

    rackClicked(event) {
        const { row, rack, subRow } = this.rackAndRowForPolygon(event.target);
        if (this.points && this.points[this.points.length - 1] && this.points[this.points.length - 1].value) {
            if (this.displayOption === 'rowLoad') {
                this.sendPointData({
                    $info: { type: 'Sub Row', row, subRow }
                });
            } else if (this.displayOption === 'racksLoads') {
                this.sendPointData({
                    $info: { type: 'Rack', rack, row, subRow }
                });
            } else if (this.displayOption === 'TAPSumRatios') {
                this.sendPointData({
                    $info: { type: 'Rat', row, subRow, point: this.pointsBySubRow[`${row}-${subRow}`] }
                });
            } else {
                const { aisle, type, row, rack } = this.rackAndRowForPolygon(event.target);
                const temperature = this.pointsByRowValue[`${aisle}-Value-${row}-${rack}`];

                this.sendPointData({
                    $info: { type: 'Env', rack: rack, row: row, point: temperature }
                });
            }
        }
    }
}

export default {
    bindings: {
        points: '<',
        displayOption: '<',
        displayOptionEnvironment: '<?',
        tempLevel: '<?',
        sendPointData: '&',
        busway: '<?'
    },
    controller: ZonesSvgController,
    template
};
