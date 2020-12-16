/**
 * Copyright (C) 2020 RadixIot. All rights reserved.
 * @author Luis Güette
 */

import template from './overallHealth.html';
import './overallHealth.css';

class OverallHealthController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['$scope', 'maDataPointTags', 'maEvents', 'maUiDateBar'];
    }

    constructor($scope, maDataPointTags, maEvents, maUiDateBar) {
        this.$scope = $scope;
        this.maDataPointTags = maDataPointTags;
        this.maEvents = maEvents;
        this.maUiDateBar = maUiDateBar;
    }

    $onInit() {
        this.getActiveAlarms();
        this.getAlarms();

        this.maUiDateBar.subscribe((event, changed) => {
            if (changed.includes('from') || changed.includes('to')) {
                const from = this.maUiDateBar.from.valueOf();
                const to = this.maUiDateBar.to.valueOf();
                if (this.from !== from || this.to !== to) {
                    this.getAlarms();
                }
            }
        }, this.$scope);
    }

    getActiveAlarms() {
        const queryBuilder = this.maEvents.notificationManager.buildActiveQuery();
        queryBuilder.eq('eventType.eventType', 'DATA_POINT');
        this.activeAlarms = queryBuilder.activeEvents();
    }

    getAlarms() {
        this.from = this.maUiDateBar.from.valueOf();
        this.to = this.maUiDateBar.to.valueOf();

        const queryBuilder = this.maEvents.buildQuery().eq('eventType', 'DATA_POINT').ge('activeTimestamp', this.from).lt('activeTimestamp', this.to);

        queryBuilder.query().then(
            (events) => {
                this.alarms = events;
                this.getCounts();
                this.buildChartData();
            },
            (error) => {
                delete this.alarms;
                delete this.counts;
                delete this.values;
            }
        );
    }

    getCounts() {
        this.counts = this.alarms.reduce(
            (result, alarm) => {
                if (alarm.active) result.active += 1;
                if (!alarm.acknowledged) result.unacknowledged += 1;

                return result;
            },
            {
                active: 0,
                unacknowledged: 0,
                total: 0
            }
        );
        this.counts.total = this.alarms.length;
    }

    buildChartData() {
        this.valuesObject = {
            NONE: {
                value: 0,
                text: 'None',
                color: '#9E9E9E'
            },
            INFORMATION: {
                value: 0,
                text: 'Info',
                color: '#47b275'
            },
            IMPORTANT: {
                value: 0,
                text: 'Minor',
                color: '#ECC94B'
            },
            WARNING: {
                value: 0,
                text: 'Warning',
                color: '#2B6CB0'
            },
            URGENT: {
                value: 0,
                text: 'Major',
                color: '#ed7926'
            },
            CRITICAL: {
                value: 0,
                text: 'Critical',
                color: '#ed1f1f'
            },
            LIFE_SAFETY: {
                value: 0,
                text: 'Safety',
                color: '#F44336'
            }
        };

        for (const alarm of this.alarms) {
            this.valuesObject[alarm.alarmLevel].value++;
        }

        this.values = Object.values(this.valuesObject).filter((v) => v.value);
    }
}

export default {
    bindings: {},
    controller: OverallHealthController,
    template
};
