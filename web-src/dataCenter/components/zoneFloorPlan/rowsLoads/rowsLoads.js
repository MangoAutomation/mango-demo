/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jose Puccini
 */

import template from './rowsLoads.html';
import './rowsLoads.css';

class RowsLoadsController {
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
        if (changes.rowInfoObj) {
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

    updateSnowMetrics() {
        if (this.rowInfoObj) {
            const {region, campus, zone, row, subRow} = this.rowInfoObj;
            if (row != null && subRow != null) {
                this.dcSnowData.metrics({
                    from: this.dateBar.from,
                    to: this.dateBar.to,
                    region, campus, zone, row, subRow
                }).then(metrics => {
                    this.rowInfoObj.snowMetrics = metrics;
                });
            }
        }
    }
}

export default {
    bindings: {
        rowInfoObj: '<'
    },
    controller: RowsLoadsController,
    template
};
