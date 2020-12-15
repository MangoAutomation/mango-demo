/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jose Puccini
 */

import template from './zoneFloorPlan.html';
import './zoneFloorPlan.css';

const LOAD_NAMES = ['Load Percentage', 'Temperature', 'Humidity', 'kW Total TAPSum ratio'];

const POINT_NAME_MAP = {
    'Average TBLM Current': 'averageTBLMCurrent',
    'Total Health': 'health',
    'kW Total': 'load',
    'Load Percentage': 'loadPercentage',
    'kWh Total': 'deliveredEnergy',
    'Max Voltage Imbalance': 'maxPhaseVoltagesUnbalance',
    'Max Current Imbalance': 'maxPhaseCurrentsUnbalance',
    'iTHD Max': 'maxiTHD',
    'vTHD Max': 'maxvTHD',
    'PF Min': 'lowestPowerFactor',
    Temperature: 'temperature',
    Humidity: 'humidity',
    'kW Total TAPSum ratio': 'TAPSumRatio'
};

const POINT_NAMES = [
    'Average TBLM Current',
    'Total Health',
    'kW Total',
    'Load Percentage',
    'kWh Total',
    'Max Voltage Imbalance',
    'Max Current Imbalance',
    'iTHD Max',
    'vTHD Max',
    'PF Min',
    'Temperature',
    'Humidity',
    'kW Total TAPSum ratio'
];

const EQUIPMENT_TYPES = ['Zone', 'Rack', 'Sub Row', 'Temperature', 'Humidity', 'Busway'];

class ZoneFloorPlanController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['$mdMedia', 'dcUtil'];
    }

    constructor($mdMedia, dcUtil) {
        this.$mdMedia = $mdMedia;
        this.dcUtil = dcUtil;
    }

    $onInit() {
        this.rackPowerRack = 'rackPowerRack';
        this.displayOption = 'racksLoads';
        this.displayOptionEnvironment = 'coldAisleTemperatures';
        this.tempLevel = 'Lower';
        this.busway = 'A';
    }

    $onChanges(changes) {
        if (changes.searchOptions && changes.searchOptions.currentValue) {
            console.log('hola');
            // erase data from a zone
            this.rowAndRackInfoObj = { ...this.searchOptions };

            this.selectionChanged({
                $selection: null,
                $displayOption: this.displayOption,
                $displayOptionEnvironmental: this.displayOptionEnvironmental,
                $busway: this.busway
            });

            if (this.searchOptions.zone !== null) {
                this.getDataPoints(LOAD_NAMES, EQUIPMENT_TYPES).then((points) => {
                    this.points = points;
                });
            }
        }
    }

    getDataPoints(nameArray, equipmentTypes, additionalOptions) {
        return this.dcUtil.getMultipleEquipmentPoints(equipmentTypes, this.searchOptions, nameArray, 'zone', additionalOptions);
    }

    toggle(level) {
        this.rowAndRackInfoObj = { ...this.searchOptions };

        this.displayOptionChanged({ $displayOption: this.displayOption });
    }

    getInfoPoints(rackAndRows) {
        this.selectionChanged({
            $selection: rackAndRows,
            $displayOption: this.displayOption,
            $displayOptionEnvironmental: this.displayOptionEnvironmental,
            $busway: this.busway
        });

        if (this.displayOption === 'environmental') {
            this.rowAndRackInfoObj = { ...this.searchOptions, ...rackAndRows };
            this.statisticPoints({ $points: [rackAndRows.point] });
        } else if (this.displayOption === 'TAPSumRatios') {
            this.rowAndRackInfoObj = { ...this.searchOptions, ...rackAndRows };
            this.statisticPoints({ $points: [rackAndRows.point] });
        } else {
            const optionsObj = { ...rackAndRows };
            delete optionsObj.type;
            this.getDataPoints(POINT_NAMES, [rackAndRows.type], optionsObj).then((points) => {
                this.statisticPoints({ $points: points });
                const parsedPoints = this.createPointMap(points);
                this.rowAndRackInfoObj = { ...this.searchOptions, ...optionsObj, ...parsedPoints };
            });
        }
    }

    clearInfoPoints() {
        this.rowAndRackInfoObj = { ...this.searchOptions };
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
        searchOptions: '<',
        displayOption: '<',
        displayOptionEnvironmental: '<',
        statisticPoints: '&',
        displayOptionChanged: '&',
        selectionChanged: '&',
        busway: '<'
    },
    controller: ZoneFloorPlanController,
    template
};
