/**
 * Copyright (C) 2020 RadixIot. All rights reserved.
 * @author Jose Puccini
 */

import htmlTemplate from './pointGroups.html';
import './pointGroups.css';

class PointGroupsController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['maPoint'];
    }

    constructor(maPoint) {
        this.maPoint = maPoint;
    }

    $onChanges(changes) {
        if (changes.groups && this.groups) {
            this.getPoints();
        }
    }

    getPoints() {
        this.maPoint
            .buildQuery()
            .in('tags.group', this.groups)
            .sort('name')
            .limit(1000)
            .query()
            .then(points => this.points = points);
    }
}

export default {
    bindings: {
        groups: '<',
    },
    controller: PointGroupsController,
    template: htmlTemplate
};
