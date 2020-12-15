/**
 * @copyright 2020 {@link http://Radixiot.com|Radix IOT,LLC.} All rights reserved.
 * @author Jose Puccini
 */

import template from './activeAlarms.html';
import './activeAlarms.css';

class ActiveAlarmsController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['$state', 'maEvents'];
    }

    constructor($state, maEvents) {
        this.$state = $state;
        this.maEvents = maEvents;

        this.query = {
            page: 1,
            limit: 5
        };
    }

    $onChanges(changes) {
        if (
            changes.searchOptions &&
            changes.searchOptions.currentValue &&
            changes.searchOptions.currentValue.campus
        ) {
            if (this.activeEvents) {
                this.activeEvents.deregister();
            }
            this.getAlarmCount();
        }
    }

    $onDestroy() {
        if (this.activeEvents) {
            this.activeEvents.deregister();
        }
    }

    getAlarmCount() {
        const {
            region,
            campus,
            zone,
            row,
            subRow,
            rack,
            busway,
            tb,
            cb
        } = this.searchOptions;
        const activeEventsQuery = this.maEvents.notificationManager
            .buildActiveQuery()
            .eq('eventType.eventType', 'DATA_POINT');

        if (region) {
            activeEventsQuery.eq(
                'eventType.reference1.tags.region',
                region === 'Global' ? null : region
            );
        }

        if (campus) {
            activeEventsQuery.eq('eventType.reference1.tags.campus', campus);
        }

        if (zone) {
            activeEventsQuery.eq('eventType.reference1.tags.zone', zone);
        }

        if (row) {
            activeEventsQuery.eq('eventType.reference1.tags.row', row);
        }

        if (subRow) {
            activeEventsQuery.eq('eventType.reference1.tags.subRow', subRow);
        }

        if (rack) {
            activeEventsQuery.eq('eventType.reference1.tags.rack', rack);
        }

        if (busway) {
            activeEventsQuery.eq('eventType.reference1.tags.busway', busway);
        }

        if (tb) {
            activeEventsQuery.eq('eventType.reference1.tags.tb', tb);
        }

        if (cb) {
            activeEventsQuery.eq('eventType.reference1.tags.cb', cb);
        }

        this.activeEvents = activeEventsQuery.activeEvents();
    }

    gotoEvent() {
        this.$state.go('ui.events', {
            location: 'replace',
            notify: true
        });
    }
}

export default {
    bindings: {
        searchOptions: '<'
    },
    controller: ActiveAlarmsController,
    template
};
