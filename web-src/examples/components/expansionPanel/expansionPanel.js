/**
 * Copyright (C) 2020 RadixIot. All rights reserved.
 * @author Luis Güette
 */

import htmlTemplate from './expansionPanel.html';
import './expansionPanel.css';

class ExpansionPanelController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return [];
    }

    $onInit() {
        if (this.initOpen == null) {
            this.isOpen = true;
        } else {
            this.isOpen = this.initOpen;
        }
    }
}

export default {
    bindings: {
        initOpen: '<?',
        hideIcon: '<?'
    },
    transclude: {
        header: '?exPanelHeader',
        actions: '?exPanelActions',
        body: 'exPanelBody'
    },
    controller: ExpansionPanelController,
    template: htmlTemplate
};
