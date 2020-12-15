/**
 * @copyright 2020 {@link http://Radixiot.com|Radix IOT,LLC.} All rights reserved.
 * @author Jose Puccini
 */

import template from './breadCrumbs.html';
import './breadCrumbs.css';

const DEFAULT_SEARCH_OPTIONS = {
    region: 'Global',
    campus: null,
    zone: null,
    asset: null
};

class BreadCrumbsController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['$state'];
    }

    constructor($state) {
        this.$state = $state;
    }

    $onInit() {
        this.ngModelCtrl.$render = () => this.render();
        this.page = this.$state.includes('*.fleetOverview.*.*')
            ? 'fleet'
            : 'notFleet';
    }

    render() {
        if (this.ngModelCtrl.$viewValue !== undefined) {
            this.options = this.ngModelCtrl.$viewValue;
        }
    }

    setViewValue() {
        this.ngModelCtrl.$setViewValue({ ...this.options });
    }

    optionsActions(option) {
        if (this.page === 'fleet') {
            switch (option) {
                case 'global':
                    this.options = { ...DEFAULT_SEARCH_OPTIONS };
                    break;
                case 'region':
                    this.options = {
                        ...this.options,
                        campus: null,
                        zone: null,
                        asset: null
                    };
                    break;
                case 'campus':
                    this.options = {
                        ...this.options,
                        zone: null,
                        asset: null
                    };
                    break;
                case 'zone':
                    this.options = {
                        ...this.options,
                        asset: null
                    };
                    break;
                default:
                    break;
            }

            this.$state.go('.', {
                region: this.options.region === 'Global' ? null : this.options.region,
                campus: this.options.campus,
                zone: this.options.zone
            }, { location: 'replace', notify: false });

            this.setViewValue();
        } else {
            let state = '.';
            let stateParams = {};
            switch (option) {
                case 'global':
                    state = 'ui.fleetOverview';
                    break;
                case 'region':
                    state = 'ui.fleetOverview';
                    stateParams = {
                        region: this.options.region
                    };
                    break;
                case 'campus':
                    state = this.$state.includes('*.zoneOverview.*.*')
                        ? 'ui.campusOverview'
                        : 'ui.fleetOverview';
                    stateParams = {
                        region: this.options.region,
                        campus: this.options.campus
                    };
                    break;
                case 'zone':
                    state = 'ui.fleetOverview';
                    stateParams = {
                        region: this.options.region,
                        campus: this.options.campus,
                        zone: this.options.zone
                    };
                    break;
                default:
                    break;
            }
            this.$state.go(state, stateParams, {
                location: 'replace',
                notify: true
            });
        }
    }
}

export default {
    bindings: {},
    require: {
        ngModelCtrl: 'ngModel'
    },
    controller: BreadCrumbsController,
    template
};
