/**
 * Copyright (C) 2020 RadixIot. All rights reserved.
 * @author Luis Güette
 */

import template from './charts.html';
import './charts.css';

class ChartsController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['maPoint'];
    }

    constructor(maPoint) {
        this.maPoint = maPoint;
    }

    $onInit() {
        this.getPoints();
    }

    getPoints() {
        this.maPoint
            .buildQuery()
            .eq('tags.trend', 'true')
            .query()
            .then(points => this.points = points);
    }
}

export default {
    bindings: {},
    controller: ChartsController,
    template
};
