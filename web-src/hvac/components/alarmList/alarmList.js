/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Luis Güette
 */

import htmlTemplate from './alarmList.html';
import './alarmList.css';

const EVENT_KEYS = {
    NONE: 'none',
    INFORMATION: 'information',
    IMPORTANT: 'important',
    WARNING: 'warning',
    URGENT: 'urgent',
    CRITICAL: 'critical',
    SAFETY: 'safety',
};

class AlarmListController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['maEvents', '$scope'];
    }

    constructor(Events, $scope) {
        this.Events = Events;
        this.$scope = $scope;
    }

    $onInit() {
        this.getEvents();
    }

    getEvents() {
        this.Events.buildQuery()
            .or()
            .eq('active', true)
            .limit(1000)
            .query()
            .then((events) => {
                this.eventsCount = this.mapEvents(events);
                this.subscribeToEvents();
            });
    }

    mapEvents(events) {
        return events.reduce(
            (result, event) => {
                const shortName = EVENT_KEYS[event.alarmLevel];

                if (Object.keys(EVENT_KEYS).includes(event.alarmLevel)) {
                    result[shortName] += 1;
                }

                return result;
            },
            {
                none: 0,
                information: 0,
                important: 0,
                warning: 0,
                urgent: 0,
                critical: 0,
                safety: 0,
            }
        );
    }

    subscribeToEvents() {
        this.Events.notificationManager.subscribe(
            (event, mangoEvent) => {
                if (mangoEvent.id < 0) {
                    return;
                }

                const shortName = EVENT_KEYS[mangoEvent.alarmLevel];

                if (event.name === 'RAISED' && mangoEvent.active) {
                    this.eventsCount[shortName] += 1;
                }

                if (event.name === 'RETURN_TO_NORMAL' && !mangoEvent.active) {
                    this.eventsCount[shortName] -= 1;
                }
            },
            this.$scope,
            ['RAISED', 'RETURN_TO_NORMAL']
        );
    }
}

export default {
    bindings: {},
    controller: AlarmListController,
    template: htmlTemplate,
};
