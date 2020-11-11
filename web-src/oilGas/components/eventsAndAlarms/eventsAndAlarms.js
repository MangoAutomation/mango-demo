/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Pier Puccini
 */

import stallionEventsAlarmsTable from './eventsAndAlarms.html';
import './eventsAndAlarms.css';

class StallionEventsAlarmsTableController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return [];
    }
}

export default {
    bindings: {
        pointIds: '<'
    },
    controller: StallionEventsAlarmsTableController,
    template: stallionEventsAlarmsTable
};
