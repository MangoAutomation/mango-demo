/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Pier Puccini
 */

import template from './statisticsWidget.html';
import './statisticsWidget.css';

const PRESET_COLORS = ['#FF6600', '#FCD202', '#B0DE09', '#0D8ECF', '#2A0CD0', '#CD0D74', '#CC0000', '#00CC00', '#0000CC', '#DDDDDD', '#999999', '#333333', '#990000'];

class StatisticsWidgetController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['$q', '$filter', 'maUiDateBar'];
    }

    constructor($q, $filter, maUiDateBar) {
        this.$q = $q;
        this.dateBar = maUiDateBar;
        this.maFilter = $filter('maFilter');

        this.selectedPoints = [];

        this.axisOptions = [
            { name: 'left', translation: 'ui.app.left' },
            { name: 'right', translation: 'ui.app.right' },
            { name: 'left-2', translation: 'ui.app.farLeft' },
            { name: 'right-2', translation: 'ui.app.farRight' }
        ];

        this.graphOptions = [];
        this.chartOptions = { valueAxes: [] };
        this.settings = {};

        this.showCampus = false;
        this.showRegion = false;
        this.showZone = false;
    }

    $onChanges(changes) {
        if (changes.points && changes.points.currentValue) {
            this.selectedPoints = [];
            this.settings = {};
            if (this.defaultPoints) {
                this.setDefaultPoints(true);
            }
        }
    }

    getPoints(filter) {
        if (this.points) {
            return this.$q.resolve(this.maFilter(this.points, filter, ['name', 'native', 'common']));
        }
        return [];
    }

    setDefaultPoints(showLocator) {
        if (this.defaultPoints.length > 0) {
            this.getPoints().then((points) => {
                this.selectedPoints = points.filter((point) => this.defaultPoints.includes(point.name));
                this.buildSettings();
            });
            this.showCampus = showLocator;
            this.showRegion = showLocator;
            this.showZone = showLocator;
        }
    }

    checkSelectedPoints() {
        return this.selectedPoints.length > 0;
    }

    buildSettings() {
        if (this.selectedPoints[this.selectedPoints.length - 1] === 'clear') {
            this.selectedPoints = [];
            this.settings = {};
        }
        if (this.selectedPoints[this.selectedPoints.length - 1] !== 'clear') {
            this.selectedPoints.forEach((point, index) => {
                let { chartColour, valueAxis } = point;
                chartColour = chartColour === '' ? PRESET_COLORS[index % PRESET_COLORS.length] : chartColour;
                valueAxis = valueAxis == null ? this.axisOptions[index % this.axisOptions.length].name : valueAxis;

                this.selectedPoints[index].chartColour = chartColour;
                this.selectedPoints[index].valueAxis = valueAxis;

                this.settings = {
                    ...this.settings,
                    [point.xid]: {
                        graphOptions: {
                            lineColor: chartColour,
                            valueAxis
                        },
                        chartOptions: {
                            axisColor: chartColour,
                            color: chartColour
                        }
                    }
                };
            });

            const settingXids = Object.keys(this.settings);
            if (settingXids.length > this.selectedPoints.length) {
                this.removeSettings();
            }
        } else {
            this.selectedPoints = [];
            this.settings = {};
        }
        this.buildOptions();
    }

    editSettings(point) {
        const { plotType, chartColour, valueAxis } = point;

        point.valueAxis = valueAxis;
        point.chartColour = chartColour;

        this.settings[point.xid] = {
            graphOptions: { lineColor: chartColour, plotType, valueAxis },
            chartOptions: {
                axisColor: chartColour,
                color: chartColour
            }
        };

        this.buildOptions();
    }

    removeSettings() {
        const settingXids = Object.keys(this.settings);
        const selectedPointsXids = this.selectedPoints.map((point) => point.xid);
        const xidToDelete = settingXids.filter((xid) => !selectedPointsXids.includes(xid));
        delete this.settings[xidToDelete];
    }

    buildOptions() {
        this.graphOptions = [];
        this.chartOptions = { valueAxes: [] };

        this.selectedPoints.forEach((point, i) => {
            const settings = this.settings[point.xid] || {};
            const color = PRESET_COLORS[i % PRESET_COLORS.length];

            this.chartOptions.valueAxes[i] = settings.chartOptions;
            this.graphOptions[i * 3] = {
                id: `${point.xid}_min`,
                valueField: `minimum_${point.xid}`,
                title: `${point.name} (min)`,
                type: 'line',
                lineColor: point.chartColour || color,
                fillColors: point.chartColour || color,
                fillToGraph: `${point.xid}_avg`,
                fillAlphas: 0.5,
                lineThickness: 1,
                visibleInLegend: false,
                ...settings.graphOptions
            };
            this.graphOptions[i * 3 + 1] = {
                id: `${point.xid}_avg`,
                valueField: `average_${point.xid}`,
                title: `${point.name} (avg)`,
                type: 'line',
                lineColor: point.chartColour || color,
                lineThickness: 2,
                ...settings.graphOptions
            };
            this.graphOptions[i * 3 + 2] = {
                id: `${point.xid}_max`,
                valueField: `maximum_${point.xid}`,
                title: `${point.name} (max)`,
                type: 'line',
                lineColor: point.chartColour || color,
                fillColors: point.chartColour || color,
                fillToGraph: `${point.xid}_avg`,
                fillAlphas: 0.5,
                lineThickness: 1,
                visibleInLegend: false,
                ...settings.graphOptions
            };
        });
    }
}

export default {
    bindings: {
        points: '<?',
        defaultPoints: '<?',
        hideSettings: '<?',
        column: '<?',
        hideExport: '<?'
    },
    controller: StatisticsWidgetController,
    template
};
