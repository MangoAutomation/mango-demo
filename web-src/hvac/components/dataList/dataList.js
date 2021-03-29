/**
 * Copyright (C) 2021 RadixIot. All rights reserved.
 * @author Luis Güette
 */

import template from './dataList.html';
import './dataList.css';

class DataListController {
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
    bindings: {
        data: '<',
    },
    controller: DataListController,
    template,
};
