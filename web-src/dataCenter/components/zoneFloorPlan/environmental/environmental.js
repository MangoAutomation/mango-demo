/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jose Puccini
 */

import template from './environmental.html';
import './environmental.css';

class EnvironmentalController {
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
        envInfoObj: '<'
    },
    controller: EnvironmentalController,
    template
};
