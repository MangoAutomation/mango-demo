/**
 * @copyright 2020 {@link http://Radixiot.com|Radix IOT,LLC.} All rights reserved.
 * @author Luis Güette
 */

import template from './siteFloorPlan.html';
import './siteFloorPlan.css';
import floorPlanSvg from './assets/siteFloorPlan.svg';
import floorPlanBackground from './assets/siteFloorPlanBackground.png';

class SiteFloorPlanController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['dcUtil'];
    }

    constructor(dcUtil) {
        this.dcUtil = dcUtil;

        this.floorPlanSvg = floorPlanSvg;
        this.floorPlanBackground = floorPlanBackground;
    }

    $onInit() {}

    $onChanges(changes) {
        if (changes.site && this.site) {
            this.dcUtil.dataHallOptions(this.site).then(dataHalls => {
                this.dataHallPoints = dataHalls.reduce((result, item) => {
                    result[this.dcUtil.snakeToCamel(item)] = this.points
                        .filter(p => p.tags.dataHall === item)
                        .reduce((pResult, p) => {
                            pResult[this.dcUtil.snakeToCamel(p.name.replace(' ', '_'))] = p;
                            return pResult;
                        }, {});
                    return result;
                }, {});
            });
        }
    }

    setBackgroundColorClass(dataHall) {
        return {
            'st4': this.dataHallPoints[dataHall].loadPercentage.value < 50.0,
            'st0': this.dataHallPoints[dataHall].loadPercentage.value >= 50.0 && this.dataHallPoints[dataHall].loadPercentage.value < 90.0,
            'st5': this.dataHallPoints[dataHall].loadPercentage.value >= 90.0
        };
    }
}

export default {
    bindings: {
        site: '<',
        points: '<'
    },
    controller: SiteFloorPlanController,
    template: template
};
