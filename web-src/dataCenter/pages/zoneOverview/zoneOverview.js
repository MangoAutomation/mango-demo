/**
 * @copyright 2020 {@link http://Radixiot.com|Radix IOT,LLC.} All rights reserved.
 * @author Jose Puccini
 */

import zoneTemplate from './zoneOverview.html';
import './zoneOverview.css';

class ZoneOverviewController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['$stateParams'];
    }

    constructor($stateParams) {
        this.$stateParams = $stateParams;

        this.statisticDefaults = ['kW Total'];
    }

    $onInit() {
        this.displayOption = 'racksLoads';
        if (this.$stateParams.zone) {
            this.setStateParams();
            this.displayOption = 'racksLoads';
        }
    }

    setStateParams() {
        this.selectedOptions = {
            searchOptions: {
                region: this.$stateParams.region,
                campus: this.$stateParams.campus || null,
                zone: this.$stateParams.zone || null,
                row: null,
                asset: null
            }
        };
    }

    updateSearchOptions() {
        this.selectedOptions = { ...this.selectedOptions };
    }

    setStatisticsPoints(svgPoints) {
        if (svgPoints) {
            this.statisticPoints = svgPoints;
        } else if (this.selectedOptions.specificPoints && this.selectedOptions.specificPoints.length > 0 && svgPoints == null) {
            this.statisticPoints = this.selectedOptions.specificPoints;
        }
    }

    selectRackRow(selection) {
        this.selection = {
            ...this.selectedOptions.searchOptions,
            ...selection
        };
    }

    setDisplayOption(displayOption) {
        this.selection = null;
        this.displayOption = displayOption;
    }
}

export default {
    bindings: {},
    controller: ZoneOverviewController,
    template: zoneTemplate
};
