/**
 * Copyright (C) 2020 RadixIot. All rights reserved.
 * @author Jose Puccini
 */

import htmlTemplate from './overviewPage.html';
import './overviewPage.css';

class OverviewController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['edcSites'];
    }

    constructor(edcSites) {
        this.edcSites = edcSites;
    }

    $onInit() {
        this.getSite();
    }

    getSite() {
        this.edcSites.list().then(sites => {
            this.site = sites[0];
        });
    }
}

export default {
    bindings: {},
    controller: OverviewController,
    template: htmlTemplate
};
