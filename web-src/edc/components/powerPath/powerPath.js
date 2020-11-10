/**
 * Copyright (C) 2020 RadixIot. All rights reserved.
 * @author Pier Puccini / Jose Puccini
 */

import htmlTemplate from './powerPath.html';
import './powerPath.css';

class PowerPathController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['maJsonStore'];
    }

    constructor(maJsonStore) {
        this.maJsonStore = maJsonStore;
    }

    $onChanges(changes) {
        if (changes.xid && changes.xid.currentValue !== '') {
            this.getMarkup();
        }
    }

    getMarkup() {
        this.maJsonStore.get({ xid: this.xid }).$promise.then((item) => {
            this.selectedDashboardMarkup = item.jsonData.markup;
        });
    }
}

export default {
    bindings: {
        xid: '@'
    },
    controller: PowerPathController,
    template: htmlTemplate
};
