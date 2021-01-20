/**
 * @copyright 2020 {@link http://Radixiot.com|Radix IOT,LLC.} All rights reserved.
 * @author Luis Güette
 */

import zoneTemplate from './dataHallOverview.html';
import './dataHallOverview.css';

class DataHallController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return [];
    }

    constructor() {
        this.statisticDefaults = ['kW Total'];
    }

    onSelectorUpdate() {
        if (this.selectedOptions.searchOptions) {
            this.selectedDataHall =  this.selectedOptions.searchOptions.dataHall;
            this.selectedSite =  this.selectedOptions.searchOptions.site;
        }
        this.selectedPoints =  [...this.selectedOptions.specificPoints];
        this.statisticPoints = this.selectedPoints;
    }
}

export default {
    bindings: {},
    controller: DataHallController,
    template: zoneTemplate
};
