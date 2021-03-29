/**
 * Copyright (C) 2021 RadixIot. All rights reserved.
 * @author Luis Güette
 */

import template from './unitDetails.html';
import './unitDetails.css';

class UnitDetailsController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return [];
    }

    constructor() {}

    $onInit() {}

    onUnitChange() {
        this.unitData = [
            {
                title: 'Name',
                value: this.unit.name,
            },
            {
                title: 'Type',
                value: this.unit.type,
            },
        ];
    }
}
export default {
    bindings: {},
    controller: UnitDetailsController,
    template,
};
