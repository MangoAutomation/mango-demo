/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Luis Güette
 */

import angular from 'angular';
import template from './pointSelectors.html';
import './pointSelectors.css';

const DEFAULT_OPTIONS = {
    searchOptions: {
        site: null,
        dataHall: null,
    },
    specificPoints: []
};
class PointSelectorsController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['$state', '$filter', 'localStorageService', 'maDataPointTags', 'maPoint', 'dcUtil'];
    }

    constructor($state, $filter, localStorageService, maDataPointTags, maPoint, dcUtil) {
        this.$state = $state;

        this.maFilter = $filter('maFilter');

        this.localStorageService = localStorageService;

        this.maDataPointTags = maDataPointTags;
        this.maPoint = maPoint;

        this.dcUtil = dcUtil;
    }

    $onInit() {
        this.ngModelCtrl.$render = () => this.render();
        this.doInicialQuery = false;
    }

    render() {
        if (this.ngModelCtrl.$viewValue === undefined) {
            this.options = angular.copy(DEFAULT_OPTIONS);
            this.setViewValue();
        } else {
            this.options = this.ngModelCtrl.$viewValue;
            this.doInicialQuery = true;
        }
        if (this.doInicialQuery) {
            this.getPoints();
        }
    }

    setViewValue(setDefault) {
        if (setDefault) {
            let { searchOptions, specificPoints } = DEFAULT_OPTIONS;
            searchOptions = null;
            specificPoints = [];
            this.ngModelCtrl.$setViewValue({
                searchOptions,
                specificPoints
            });
        } else {
            this.ngModelCtrl.$setViewValue({ ...this.options });
        }
    }

    getSiteOptions(filter) {
        return this.dcUtil.siteOptions().then(sites => this.maFilter(sites, filter, []).sort());
    }

    getDataHallOptions(filter, site) {
        return this.dcUtil.dataHallOptions(site)
            .then(dataHalls => this.maFilter(dataHalls, filter, []).sort());
    }

    searchOptionsHandler(type) {
        const { searchOptions } = this.options;
        const { site, dataHall } = searchOptions;

        if ((type === 'site' && site && !dataHall) || (type === 'dataHall')) {
            this.getPoints();
        }
    }

    getPoints() {
        this.dcUtil.getSpecificPoints(this.options.searchOptions)
            .then((points) => {
                this.options.specificPoints = points;
                this.setViewValue();
            })
            .catch(() => {
                this.setViewValue();
            });
    }
}

export default {
    bindings: {},
    require: {
        ngModelCtrl: 'ngModel'
    },
    controller: PointSelectorsController,
    template
};
