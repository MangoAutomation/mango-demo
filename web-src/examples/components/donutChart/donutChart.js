/**
 * Copyright (C) 2020 RadixIot. All rights reserved.
 * @author Luis Güette
 */

import htmlTemplate from './donutChart.html';
import './donutChart.css';

const DEFAULT_OPTIONS = {
    labelRadius: 0,
    innerRadius: '20%',
    labelsEnabled: false,
    maxLabelWidth: 0,
    marginLeft: -50,
    marginRight: -50,
    marginTop: -50,
    marginBottom: -50,
    tapToActivate: false,
    legend: {
        align: 'center',
        maxColumns: 2
    }
};

class DonutChartController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return [];
    }

    constructor() {
        this.chartOptions = DEFAULT_OPTIONS;
    }

    $onInit() {}

    $onChanges(changes) {
        if (changes.options && this.options) {
            Object.assign(this.chartOptions, DEFAULT_OPTIONS, this.options);
        }
    }
}

export default {
    bindings: {
        height: '@',
        width: '@',
        values: '<',
        options: '<?'
    },
    controller: DonutChartController,
    template: htmlTemplate
};
