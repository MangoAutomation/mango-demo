/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Pier Puccini
 */
import fillableTanksTemplate from './fillableTanks.html';

import rectTankSvg from '../../assets/rectTank.svg';
import steppedTankSvg from '../../assets/steppedTank.svg';
import cylindricalTankSvg from '../../assets/cylindricalTank.svg';

import './fillableTanks.css';

class StallionFillableTanksController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['maDialogHelper'];
    }

    constructor(maDialogHelper) {
        this.maDialogHelper = maDialogHelper;

        this.rectTankSvg = rectTankSvg;
        this.steppedTankSvg = steppedTankSvg;
        this.cylindricalTankSvg = cylindricalTankSvg;
    }

    $onInit() {}

    $onChanges(changes) {
        if (changes.sensor && changes.sensor.currentValue) {
            const { dimensions, detectors } = this.sensor.data;
            const { tankType } = dimensions;

            if (tankType === 'rectangular') {
                this.tankSvg = this.rectTankSvg;
            } else if (tankType === 'stepped') {
                this.tankSvg = this.steppedTankSvg;
                this.steppedTank = {
                    "name": "stepped-tank-1",
                    "steps": [
                        {
                            "level": 1,
                            "volume": 1
                        },
                        {
                            "level": 2,
                            "volume": 2
                        }
                    ],
                }
            } else {
                this.tankSvg = this.cylindricalTankSvg;
            }
            this.detectorsObj = detectors
                .filter((d) => d.enabled && d.key !== 'roc')
                .reduce((dResult, d) => {
                    const keyName = d.alarmLevel.toLowerCase();
                    dResult[keyName] = {
                        [d.detectorType.toLowerCase()]: d.limit
                    };
                    return dResult;
                }, {});
        }
    }

    svgTankFill(limit, rtnNumber) {
        let result = '';
        if (this.sensor) {
            const { points, data } = this.sensor;
            if (points && points.volume && data.capacity) {
                result = Math.ceil((points.volume.value / data.capacity) * 100);
                if (!rtnNumber) {
                    result = limit >= result && result > limit - 10;
                }
            }
        }
        return result;
    }

    svgColorFill(limit) {
        let result = 'svg-color-fill';
        const warningClass = 'oil-gas-yellow';
        const dangerClass = 'oil-gas-red';
        const fillValue = this.svgTankFill(limit, true);
        if (this.detectorsObj) {
            const { warning, critical } = this.detectorsObj;
            if (
                warning &&
                warning.low_limit &&
                warning.low_limit >= fillValue
            ) {
                result = `${result} ${warningClass}`;
            }
            if (
                warning &&
                warning.high_limit &&
                warning.high_limit <= fillValue
            ) {
                result = `${result} ${warningClass}`;
            }
            if (
                critical &&
                critical.low_limit &&
                critical.low_limit >= fillValue
            ) {
                result = `${result} ${dangerClass}`;
            }
            if (
                critical &&
                critical.high_limit &&
                critical.high_limit <= fillValue
            ) {
                result = `${result} ${dangerClass}`;
            }
        }
        return result;
    }
}

export default {
    bindings: {
        sensor: '<'
    },
    controller: StallionFillableTanksController,
    template: fillableTanksTemplate
};
