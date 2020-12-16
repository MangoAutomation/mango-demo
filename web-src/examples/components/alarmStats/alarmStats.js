/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Luis Güette
 */

import moment from 'moment';
import htmlTemplate from './alarmStats.html';
import './alarmStats.css';

const MINUTE = 60000;
const HOUR = 3600000;
const DAY = 86400000; //milliseconds
const MONTH = 2592000000; //milliseconds

const ALARM_LEVELS = {
    'INFORMATION': {name: 'informational', color: '#47b275'},
    'IMPORTANT': {name: 'important', color: '#ECC94B'},
    'WARNING': {name: 'warning', color: '#2B6CB0'},
    'URGENT': {name: 'major', color: '#ed7926'},
    'CRITICAL': {name: 'critical', color: '#ed1f1f'},
}

class AlarmStatsController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['maUiDateBar', 'maEvents'];
    }

    constructor(maUiDateBar, maEvents) {
        this.DateBar = maUiDateBar;
        this.maEvents = maEvents;
    }

    $onInit() {
        this.DateBar.subscribe((event, changed) => {
            if (changed.includes('from') || changed.includes('to')) {
                console.log('hola')
                this.buildChartData();
            }
        }, this.$scope);
    }

    openDialog(alarm) {
        this.selectedAlarm = alarm;
        this.showDialog = {};
    }

    buildChartData() {
        let timePeriods;
        if (moment(this.DateBar.to).diff(moment(this.DateBar.from)) < HOUR + 3 * MINUTE) {
            timePeriods = this.buildTimePeriodsBy('minute');
        } else if (moment(this.DateBar.to).diff(moment(this.DateBar.from)) < DAY + 3 * HOUR) {
            timePeriods = this.buildTimePeriodsBy('hour');
        } else if (moment(this.DateBar.to).diff(moment(this.DateBar.from)) < MONTH + 3 * DAY) {
            timePeriods = this.buildTimePeriodsBy('day');
        } else {
            timePeriods = this.buildTimePeriodsBy('month');
        }

        const query = this.maEvents.buildCountQuery()
            .query(timePeriods)
            .then(data => {
                this.chartData = data.reduce((result, item) => {
                    Object.keys(item.total).forEach(alarmLevel => {
                        const alarmLevelNameObject = ALARM_LEVELS[alarmLevel];
                        if (alarmLevelNameObject) {
                            result[alarmLevelNameObject.name].push({
                                timestamp: moment(item.to),
                                value: item.total[alarmLevel]
                            });
                        }
                    });
                    return result;
                }, {
                    informational: [],
                    important: [],
                    warning: [],
                    major: [],
                    critical: []
                })
            });
    }

    buildTimePeriodsBy(timeRange) {
        const start = moment(this.DateBar.from);
        let timePeriodsArray = [];
        while(this.DateBar.to > start) {
            timePeriodsArray.push(start.clone());
            start.add(1, timeRange);
        }
        timePeriodsArray.push(moment(this.DateBar.to));
        return timePeriodsArray;
    }
}

export default {
    bindings: {},
    controller: AlarmStatsController,
    template: htmlTemplate
};
