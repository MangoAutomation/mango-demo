/**
 * Copyright (C) 2020 RadixIot. All rights reserved.
 * @author Luis Güette
 */

import template from './tables.html';
import './tables.css';

class TablesController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return [];
    }

    constructor() {}

    $onInit() {}
}

export default {
    bindings: {},
    controller: TablesController,
    template
};
