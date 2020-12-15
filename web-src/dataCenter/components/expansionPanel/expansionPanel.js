/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jose Puccini
 */

import template from './expansionPanel.html';
import './expansionPanel.css';

class ExpansionPanelController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['$mdMedia'];
    }

    constructor($mdMedia) {
        this.$mdMedia = $mdMedia;
    }

    $onInit() {
        if (this.initialOpen == null) {
            this.isOpen = true;
        } else {
            this.isOpen = this.initialOpen;
            this.height = null;
        }
    }
}

export default {
    bindings: {
        cardTitle: '@',
        initialOpen: '<?',
        fillCard: '<?'
    },
    transclude: {
        content: 'content',
        actions: '?headerActions'
    },
    controller: ExpansionPanelController,
    template
};
