/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Luis Güette
 */

import htmlTemplate from './unitsTable.html';
import './unitsTable.css';
class UnitsTableController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return [];
    }

    constructor() {
        this.query = {
            limit: 10,
            page: 1,
        };
    }

    $onInit() {}
}

export default {
    bindings: {
        units: '<',
    },
    controller: UnitsTableController,
    template: htmlTemplate,
};
