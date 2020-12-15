/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Pier Puccini
 */

import template from './pointSelectors.html';
import './pointSelectors.css';

const DEFAULT_OPTIONS = {
    searchOptions: {
        region: 'Global',
        campus: null,
        zone: null,
        row: null,
        subRow: null,
        busway: null,
        rack: null,
        tb: null,
        cb: null
    },
    specificPoints: []
};

const LAST_SEARCH_OPTIONS_FLEET_KEY = 'lastSearchOptionsFeet';
const LAST_SEARCH_OPTIONS_CAMPUS_KEY = 'lastSearchOptionsCampus';
const LAST_SEARCH_OPTIONS_ZONE_KEY = 'lastSearchOptionsZone';
const LAST_SEARCH_OPTIONS_ZONE_DETAILS_KEY = 'lastSearchOptionsZoneDetails';

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
        if (this.$state.includes('*.fleetOverview.*.*')) {
            this.page = 'fleet';
            this.keyLocalStorage = LAST_SEARCH_OPTIONS_FLEET_KEY;
        } else if (this.$state.includes('*.campusOverview.*.*')) {
            this.page = 'campus';
            this.keyLocalStorage = LAST_SEARCH_OPTIONS_CAMPUS_KEY;
        } else if (this.$state.includes('*.zoneOverview.*.*')) {
            this.page = 'zone';
            this.keyLocalStorage = LAST_SEARCH_OPTIONS_ZONE_KEY;
        } else if (this.$state.includes('*.assetsDetails.*.*')) {
            this.page = 'asset';
            this.keyLocalStorage = LAST_SEARCH_OPTIONS_ZONE_DETAILS_KEY;
        }
        this.doInicialQuery = false;
    }

    render() {
        if (this.ngModelCtrl.$viewValue === undefined) {
            this.options = angular.copy(DEFAULT_OPTIONS);
            this.setViewValue();
            if (this.page !== 'fleet') {
                this.setFirstOptions(this.page);
            }
        } else {
            this.options = this.ngModelCtrl.$viewValue;
            this.doInicialQuery = true;
        }
        this.isAssetView = !this.hideAsset;
        if ((!this.isAssetView && this.page === 'fleet') || this.doInicialQuery) {
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

    setFirstOptions(page) {
        this.getRegionOptions().then((regions) => {
            [this.options.searchOptions.region] = regions;
            this.getCampusOptions().then((campuses) => {
                [this.options.searchOptions.campus] = campuses;
                this.searchOptionsHandler('campus');
                if (page === 'zone' || page === 'asset') {
                    this.getZoneOptions().then((zones) => {
                        [this.options.searchOptions.zone] = zones;
                        this.searchOptionsHandler('zone');
                        // if (page === 'asset') {
                        //     this.getRowOptions().then((rows) => {
                        //         [this.options.searchOptions.row] = rows;
                        //         this.searchOptionsHandler('row');
                        //     });
                        // }
                    });
                } else {
                    this.searchOptionsHandler('campus');
                }
            });
        });
    }

    getRegionOptions(filter) {
        return this.dcUtil.regionOptions().then((regions) => this.maFilter(regions, filter, []).sort());
    }

    getCampusOptions(filter) {
        const { region } = this.options.searchOptions;
        return this.dcUtil.campusOptions(region).then((campuses) => this.maFilter(campuses, filter, []).sort());
    }

    getZoneOptions(filter) {
        const { region, campus } = this.options.searchOptions;
        return this.dcUtil.zoneOptions(region, campus).then((zones) => this.maFilter(zones, filter, []).sort());
    }

    getRowOptions(filter) {
        const { region, campus, zone } = this.options.searchOptions;
        return this.dcUtil.rowOptions(region, campus, zone).then((rows) => this.maFilter(rows, filter, []).sort());
    }

    getSubRowOptions(filter) {
        const { region, campus, zone, row } = this.options.searchOptions;
        return this.dcUtil.subRowOptions(region, campus, zone, row).then((rows) => this.maFilter(rows, filter, []).sort());
    }

    getBwlmOptions(filter) {
        const { region, campus, zone, row, subRow } = this.options.searchOptions;
        return this.dcUtil.bwOptions(region, campus, zone, row, subRow).then((busway) => this.maFilter(busway, filter, []).sort());
    }

    getRackOptions(filter) {
        const { region, campus, zone, row, subRow, busway } = this.options.searchOptions;
        return this.dcUtil.rackOptions(region, campus, zone, row, subRow, busway).then((rack) => this.maFilter(rack, filter, []).sort());
    }

    getTblmOptions(filter) {
        const { region, campus, zone, row, subRow, busway, rack } = this.options.searchOptions;
        return this.dcUtil.tbOptions(region, campus, zone, row, subRow, busway, rack).then((tb) => this.maFilter(tb, filter, []).sort());
    }

    getCbOptions(filter) {
        const { region, campus, zone, row, subRow, busway, rack, tb } = this.options.searchOptions;
        return this.dcUtil.cbOptions(region, campus, zone, row, subRow, busway, rack, tb).then((cb) => this.maFilter(cb, filter, []).sort());
    }

    inputEnabled(input) {
        const { region, campus, zone, row, subRow, busway, rack, tb } = this.options.searchOptions;
        if (region === 'Global') {
            return false;
        }
        if (input === 'campus' && region !== 'Global') {
            return true;
        }
        if (input === 'zone' && campus) {
            return true;
        }
        if (input === 'row' && zone) {
            return true;
        }
        if (input === 'subRow' && row) {
            return true;
        }
        if (input === 'busway' && subRow) {
            return true;
        }
        if (input === 'rack' && busway) {
            return true;
        }
        if (input === 'tb' && rack) {
            return true;
        }
        if (input === 'cb' && tb) {
            return true;
        }
        if (region === 'Global') {
            return true;
        }
        return false;
    }

    changeUri() {
        const { region, campus, zone, row, subRow, rack, busway, tb, cb } = this.options.searchOptions;
        this.$state.go(
            '.',
            {
                region: region === 'Global' ? null : region,
                campus,
                zone,
                row,
                subRow,
                rack,
                busway,
                tb,
                cb
            },
            { location: 'replace', notify: false }
        );
    }

    setLocalStorage() {
        const { region } = this.options.searchOptions;
        const searchOptObj = {
            region: region === 'Global' ? null : region,
            ...this.options.searchOptions
        };

        this.localStorageService.set(this.keyLocalStorage, searchOptObj);
    }

    searchOptionsHandler(type) {
        const { searchOptions } = this.options;
        const { region, row, subRow, busway, tb, cb } = searchOptions;

        const children = this.dcUtil.findDirectChildren(type);
        if (children) {
            children.forEach((child) => {
                this.options.searchOptions[child.toLowerCase()] = null;
            });
        }

        if (this.isAssetView && (row != null || subRow != null || busway != null || tb != null || cb != null) && searchOptions[type] != null) {
            this.resetFields(type);
            this.setViewValue(true);
            this.getPoints();
        } else if (!this.isAssetView && searchOptions[type] != null) {
            this.setViewValue(true);
            this.getPoints();
        }

        if (searchOptions[type] == null) {
            this.resetFields(type);
        } else if (region === 'Global') {
            this.resetFields('global');
        }
        this.changeUri();
        this.setLocalStorage();
    }

    resetFields(field) {
        switch (field) {
            case 'global':
                this.options = angular.copy(DEFAULT_OPTIONS);
                this.options.searchOptions.region = 'Global';
                break;
            case 'campus':
                this.options.searchOptions = {
                    ...this.options.searchOptions,
                    zone: null,
                    row: null,
                    subRow: null,
                    busway: null,
                    rack: null,
                    tb: null,
                    cd: null
                };
                break;
            case 'zone':
                this.options.searchOptions = {
                    ...this.options.searchOptions,
                    row: null,
                    subRow: null,
                    busway: null,
                    rack: null,
                    tb: null,
                    cb: null
                };
                if (this.isAssetView) {
                    this.options.specificPoints = [];
                }
                break;
            case 'row':
                this.options.searchOptions = {
                    ...this.options.searchOptions,
                    subRow: null,
                    busway: null,
                    rack: null,
                    tb: null,
                    cb: null
                };
                this.options.specificPoints = [];
                break;
            case 'subRow':
                this.options.searchOptions = {
                    ...this.options.searchOptions,
                    busway: null,
                    rack: null,
                    tb: null,
                    cb: null
                };
                this.options.specificPoints = [];
                break;
            case 'busway':
                this.options.searchOptions = {
                    ...this.options.searchOptions,
                    tb: null,
                    rack: null,
                    cb: null
                };
                this.options.specificPoints = [];
                break;
            case 'rack':
                this.options.searchOptions = {
                    ...this.options.searchOptions,
                    tb: null,
                    cb: null
                };
                this.options.specificPoints = [];
                break;
            case 'tb':
                this.options.searchOptions = {
                    ...this.options.searchOptions,
                    cb: null
                };
                this.options.specificPoints = [];
                break;
            default:
                break;
        }
        this.getPoints();
    }

    getPoints() {
        let doQuery = false;
        const { region, campus, zone, subRow, busway, tb, cb } = this.options.searchOptions;

        if (region) {
            if (this.page === 'fleet') {
                doQuery = true;
            } else if (this.page === 'zone' || this.page === 'campus') {
                doQuery = false;
            }
        }

        if (campus) {
            if (this.page === 'fleet' || this.page === 'campus') {
                doQuery = true;
            } else if (this.page === 'zone') {
                doQuery = false;
            }
        }

        if (!this.hideZone && zone) {
            if (this.page === 'fleet' || this.page === 'zone') {
                doQuery = true;
            }
        }
        if (this.isAssetView && (subRow || busway || tb || cb)) {
            doQuery = false;
        }

        this.dcUtil.getSpecificPoints(this.options.searchOptions, !this.hideZone, this.isAssetView, doQuery)
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
    bindings: {
        hideZone: '<?',
        hideAsset: '<?'
    },
    require: {
        ngModelCtrl: 'ngModel'
    },
    controller: PointSelectorsController,
    template
};
