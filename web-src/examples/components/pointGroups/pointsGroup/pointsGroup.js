/**
 * Copyright (C) 2020 RadixIot. All rights reserved.
 * @author Luis Güette
 */

import htmlTemplate from './pointsGroup.html';
import './pointsGroup.css';

class PointsGroupController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return [];
    }

    $onChanges(changes) {
        if (changes.points && this.points) {
            this.getGroupPoints();
        }
    }

    getGroupPoints() {
        this.groupPoints = this.points.filter(point => point.tags.group === this.group);
    }
}

export default {
    bindings: {
        points: '<',
        group: '<'
    },
    controller: PointsGroupController,
    template: htmlTemplate
};
