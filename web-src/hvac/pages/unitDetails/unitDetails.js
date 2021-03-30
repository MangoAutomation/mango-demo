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
        return ['maPoint', 'maDataPointTags'];
    }

    constructor(maPoint, maDataPointTags) {
        this.maPoint = maPoint;
        this.maDataPointTags = maDataPointTags;
    }

    $onInit() {}

    onUnitChange() {
        if (!this.unit) return;

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

        this.getGroupTags();
    }

    getGroupTags() {
        this.maDataPointTags
            .buildQuery('group')
            .ne('group', null)
            .eq('deviceID', this.unit.xid)
            .query()
            .then((groups) => {
                this.groups = groups;
            });
    }
}
export default {
    bindings: {},
    controller: UnitDetailsController,
    template,
};
