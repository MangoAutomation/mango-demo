/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jose Puccini
 */

import template from './legend.html';
import './legend.css';

class LegendController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['$mdMedia'];
    }

    constructor($mdMedia) {
        this.$mdMedia = $mdMedia;
    }

    $onInit() {}
}

export default {
    bindings: {
        displayOption: '<',
        displayOptionEnvironment: '<'
    },
    controller: LegendController,
    template
};
