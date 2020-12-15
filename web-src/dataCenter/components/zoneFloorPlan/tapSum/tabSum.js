/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jose Puccini
 */

import template from './tabSum.html';
import './tabSum.css';

class TabSumController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['$mdMedia'];
    }

    constructor($mdMedia) {
        this.$mdMedia = $mdMedia;
    }
}

export default {
    bindings: {
        rowInfoObj: '<'
    },
    controller: TabSumController,
    template
};
