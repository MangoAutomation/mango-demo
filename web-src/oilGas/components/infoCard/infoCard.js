/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Pier Puccini
 */

import moment from 'moment-timezone';
import infoCardTemplate from './infoCard.html';
import './infoCard.css';

class infoCardController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return [
            '$interval',
            '$filter',
            'maEvents',
            'maUiDateBar',
            'MA_DATE_RANGE_PRESETS'
        ];
    }

    constructor(
        $interval,
        $filter,
        maEvents,
        maUiDateBar,
        MA_DATE_RANGE_PRESETS
    ) {
        this.$interval = $interval;
        this.$filter = $filter;

        this.maEvents = maEvents;
        this.maUiDateBar = maUiDateBar;
        this.MA_DATE_RANGE_PRESETS = MA_DATE_RANGE_PRESETS;
    }

    $onInit() {
        if (this.dropdown === 'time') {
            this.showDropdown = true;
            this.to = new Date();
        }

        if (this.alarmType === 'active-alarms') {
            this.alarm = 'Active alarms';
        } else if (this.alarmType === 'average-alarms') {
            this.alarm = 'Average alarm duration';
        }

        if (this.alarmType === 'per-time-alarms') {
            this.parseCardName();
            // Explination can be found at #78
            this.maUiDateBar.subscribe((event, changed) => {
                if (changed.includes('from') || changed.includes('to')) {
                    if (this.pointIds) {
                        this.queryEvents(this.pointIds);
                        this.parseCardName();
                    }
                }
            }, this.$scope);

            this.maEvents.notificationManager.subscribe({
                eventTypes: ['RAISED', 'RETURN_TO_NORMAL', 'DEACTIVATED'],
                handler: (event, mangoEvent) => {
                    if (Array.isArray(this.latestEvents)) {
                        const matchesFilter = this.filter.test(mangoEvent);
                        const index = this.latestEvents.findIndex(
                            (e) => e.id === mangoEvent.id
                        );

                        if (index >= 0 && matchesFilter) {
                            Object.assign(this.latestEvents[index], mangoEvent);
                        } else if (index >= 0 && !matchesFilter) {
                            this.latestEvents.splice(index, 1);
                        } else if (index < 0 && matchesFilter) {
                            this.latestEvents.push(mangoEvent);
                        }
                    }
                }
            });
        }
    }

    $onChanges(changes) {
        if (
            changes.pointIds != null &&
            changes.pointIds.previousValue != null &&
            changes.pointIds.currentValue != null
        ) {
            const eq = angular.equals(
                changes.pointIds.currentValue,
                changes.pointIds.previousValue
            );

            if (!eq) {
                this.activeEvents.deregister();
                this.getAlarmCount(this.pointIds);
            }
        } else if (changes.pointIds != null && changes.pointIds.currentValue) {
            this.getAlarmCount(this.pointIds);
        }
    }

    $onDestroy() {
        if (this.activeEvents) {
            if (this.average) {
                this.$interval.cancel();
            }
            this.activeEvents.deregister();
        }
    }

    getAlarmCount(dataPointIds) {
        if (this.alarmType !== 'per-time-alarms') {
            // explination can be found in issue #78
            this.activeEvents = this.maEvents.notificationManager
                .buildActiveQuery()
                .eq('eventType.eventType', 'DATA_POINT')
                .in('eventType.referenceId1', dataPointIds)
                .activeEvents();

            if (this.alarmType === 'active-alarms') {
                this.alarm = 'Active alarms';
            } else {
                this.alarm = 'Average alarm duration';
                this.activeEvents.addSubscriber(() => this.updateAverage());
                this.$interval(() => this.updateAverage(), 5000);
            }
        } else {
            this.parseCardName();
            this.queryEvents(dataPointIds);
        }
    }

    parseCardName() {
        const timePreset = this.maUiDateBar.preset;
        const foundTr = this.MA_DATE_RANGE_PRESETS.find(
            (preset) => preset.type === timePreset
        );

        this.timeTranslation = this.$filter('maTr')(
            foundTr.translation,
            foundTr.translationArgs
        );
        this.alarm = `Events from ${this.timeTranslation}`;
    }

    queryEvents(dataPointIds) {
        const queryBuilder = this.maEvents
            .buildQuery()
            .eq('eventType', 'DATA_POINT')
            .in('referenceId1', dataPointIds)
            .ge('activeTimestamp', this.maUiDateBar.from.valueOf());
        if (
            !(
                this.maUiDateBar.autoUpdate &&
                this.maUiDateBar.preset &&
                this.maUiDateBar.preset.startsWith('LAST_')
            )
        ) {
            queryBuilder.lt('activeTimestamp', this.maUiDateBar.to.valueOf());
        }

        queryBuilder.query().then((events) => {
            this.latestEvents = events;
        });
        this.filter = queryBuilder.createFilter();
    }

    updateAverage() {
        if (this.activeEvents.events.length > 0) {
            const eventsSum = this.activeEvents.events.reduce(
                (sum, event) => sum + event.duration,
                0
            );

            this.average = this.formatDuration(
                eventsSum / this.activeEvents.events.length
            );
        } else {
            this.average = 'No events';
        }
    }

    formatDuration(duration) {
        if (duration < 1000) {
            return `${duration} ms`;
        }
        if (duration < 5000) {
            return `${Math.round(duration / 100) / 10} s`;
        }
        if (duration < 60000) {
            return `${Math.round(duration / 1000)} s`;
        }
        return moment.duration(duration).humanize();
    }
}
// TODO REMOVE OPTIONALS
export default {
    bindings: {
        customPoint: '<?',
        alarmType: '@?',
        dropdown: '@?',
        headerColor: '@',
        icon: '@?',
        point: '<?',
        pointIds: '<?',
        title: '@?'
    },
    transclude: true,
    controller: infoCardController,
    template: infoCardTemplate
};
