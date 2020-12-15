/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jose Puccini
 */

import template from './racksLoads.html';
import './racksLoads.css';

class RacksLoadsController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['$mdMedia', 'dcSnowData', 'maUiDateBar', '$scope'];
    }

    constructor($mdMedia, dcSnowData, maUiDateBar, $scope) {
        this.$mdMedia = $mdMedia;
        this.dcSnowData = dcSnowData;
        this.dateBar = maUiDateBar;
        this.$scope = $scope;
    }

    $onChanges(changes) {
        if (changes.rackInfoObj) {
            this.updateSnowData();
            this.updateSnowMetrics();
        }
    }

    $onInit() {
        this.dateBar.subscribe((event, changed) => {
            if (changed.includes('from') || changed.includes('to')) {
                this.updateSnowMetrics();
            }
        }, this.$scope);
    }

    updateSnowData() {
        if (this.rackInfoObj) {
            const {region, campus, zone, row, rack} = this.rackInfoObj;
            if (row != null && rack != null) {
                const xid = [region, campus, zone, row, rack].join('_');
                this.dcSnowData.get(xid).then(data => {
                    this.rackInfoObj.snowData = data;
                }, error => null);
            }
        }
    }

    updateSnowMetrics() {
        if (this.rackInfoObj) {
            const {region, campus, zone, row, rack} = this.rackInfoObj;
            if (row != null && rack != null) {
                this.dcSnowData.metrics({
                    from: this.dateBar.from,
                    to: this.dateBar.to,
                    region, campus, zone, row, rack
                }).then(metrics => {
                    this.rackInfoObj.snowMetrics = metrics;
                });
            }
        }
    }
}

export default {
    bindings: {
        rackInfoObj: '<'
    },
    controller: RacksLoadsController,
    template
};
