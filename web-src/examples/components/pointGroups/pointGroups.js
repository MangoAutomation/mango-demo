/**
 * Copyright (C) 2020 RadixIot. All rights reserved.
 * @author Luis Güette
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
        const query = this.maPoint
            .buildQuery();

        if (this.filterTags) {
            Object.keys(this.filterTags).forEach(tag => {
                query.eq(`tags.${tag}`, this.filterTags[tag]);
            });
        }

        query
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
        filterTags: '<?'
    },
    controller: PointGroupsController,
    template: htmlTemplate
};
