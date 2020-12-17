/**
 * Copyright (C) 2020 RadixIot. All rights reserved.
 * @author Pier Puccini
 */

import moment from 'moment';

import htmlTemplate from './activeAlarms.html';
import './activeAlarms.css';

class ActiveAlarmsController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['$scope', 'maEvents', 'maUiDateBar'];
    }

    constructor($scope, maEvents, maUiDateBar) {
        this.$scope = $scope;
        this.maEvents = maEvents;
        this.maUiDateBar = maUiDateBar;

        this.query = {
            page: 1,
            limit: 5
        };
    }

    $onInit() {
        this.maUiDateBar.subscribe((event, changed) => {
            if (changed.includes('from') || changed.includes('to')) {
                this.queryEvents();
            }
        }, this.$scope);
    }

    $onChanges(changes) {
        if (changes.siteXid && changes.siteXid.currentValue) {
            if (this.activeEvents) {
                this.activeEvents.deregister();
            }
            this.queryEvents();
        }
    }

    $onDestroy() {
        if (this.activeEvents) {
            this.activeEvents.deregister();
        }
    }

    queryEvents() {
        const activeEventsQuery = this.maEvents.notificationManager
            .buildActiveQuery()
            .eq('eventType.eventType', 'DATA_POINT')
            .ge('activeTimestamp', this.maUiDateBar.from.valueOf())
            .lt('activeTimestamp', this.maUiDateBar.to.valueOf());

        if (this.siteXid) {
            activeEventsQuery.eq('eventType.reference1.tags.site', this.siteXid);
        }

        this.activeEvents = activeEventsQuery.activeEvents();
    }
}

export default {
    bindings: {
        siteXid: '<?site',
    },
    controller: ActiveAlarmsController,
    template: htmlTemplate
};
