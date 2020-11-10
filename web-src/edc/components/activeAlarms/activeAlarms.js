/**
 * Copyright (C) 2020 RadixIot. All rights reserved.
 * @author Pier Puccini
 */

import htmlTemplate from './activeAlarms.html';
import './activeAlarms.css';

class ActiveAlarmsController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['maEvents'];
    }

    constructor(maEvents) {
        this.maEvents = maEvents;

        this.query = {
            page: 1,
            limit: 5
        };
    }

    $onInit() {}

    $onChanges(changes) {
        if (changes.siteXid && changes.siteXid.currentValue) {
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
        const activeEventsQuery = this.maEvents.notificationManager.buildActiveQuery().eq('eventType.eventType', 'DATA_POINT').eq('eventType.reference1.tags.site', this.siteXid);

        if (this.equipmentType) {
            activeEventsQuery.eq('eventType.reference1.tags.equipmentType', this.equipmentType);
        }

        this.activeEvents = activeEventsQuery.activeEvents();
    }
}

export default {
    bindings: {
        siteXid: '<site',
        equipmentType: '@'
    },
    controller: ActiveAlarmsController,
    template: htmlTemplate
};
