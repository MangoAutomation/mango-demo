/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Pier Puccini
 */

import stallionExpansionPanel from './expansionPanel.html';
import './expansionPanel.css';

class stallionExpansionPanelController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return [];
    }

    $onInit() {
        if (this.initialOpen == null) {
            this.isOpen = true;
        } else {
            this.isOpen = this.initialOpen;
        }

        if (this.layout == null) {
            this.layout = 'column';
        }

        if (this.order && this.order === 'reverse') {
            this.cardOrder = 1;
            this.divOrder = -1;
        }

        if (this.innerFlex == null) {
            this.innerFlex = '';
        }

        if (this.outerFlex == null) {
            this.outerFlex = '';
        }
    }
}

export default {
    bindings: {
        title: '@',
        initialOpen: '<?',
        // Layout refering to the normal AngularJS material layout
        layout: '@?',
        layoutAlign: '@?',
        // This will map to the flex order param, the reverse is outer, innner
        order: '@?',
        innerFlex: '@?',
        outerFlex: '@?'
    },
    transclude: {
        innerContent: 'innerContent',
        outerContent: '?outerContent'
    },
    controller: stallionExpansionPanelController,
    template: stallionExpansionPanel
};
