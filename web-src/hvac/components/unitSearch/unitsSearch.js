/**
 * Copyright (C) 2021 RadixIot. All rights reserved.
 * @author Luis Güette
 */

import template from './unitsSearch.html';
import './unitsSearch.css';

const STORAGE_KEY = 'lastSelectedUnit';

class UnitsSearchController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['hvacUnit', 'localStorageService', '$stateParams', 'maDialogHelper', '$state'];
    }

    constructor(hvacUnit, localStorageService, $stateParams, maDialogHelper, $state) {
        this.hvacUnit = hvacUnit;
        this.localStorageService = localStorageService;
        this.$stateParams = $stateParams;
        this.maDialogHelper = maDialogHelper;
        this.$state = $state;
    }

    $onInit() {
        this.ngModelCtrl.$render = () => this.render();
        this.lastSelectedUnit = this.localStorageService.get(STORAGE_KEY);

        if (this.$stateParams.xid) {
            this.hvacUnit.get(this.$stateParams.xid).then(
                (unit) => {
                    this.unit = unit;
                    this.unitUpdated();
                },
                () => {
                    this.maDialogHelper.errorToast([
                        'literal',
                        `${this.$stateParams.xid} not found`,
                    ]);
                    this.$state.go(this.$state.current.name, { xid: undefined });
                }
            );
        } else if (this.lastSelectedUnit) {
            this.unit = this.lastSelectedUnit;
            this.setViewValue();
        } else {
            this.getUnits().then((units) => {
                [this.unit] = units;
                this.unitUpdated();
            });
        }
    }

    render() {
        this.unit = this.ngModelCtrl.$viewValue;
    }

    setViewValue() {
        this.ngModelCtrl.$setViewValue({ ...this.unit });
        if (this.unit) {
            this.updateQueryParams(this.unit.xid);
        } else {
            this.updateQueryParams(undefined);
        }
    }

    getUnits(filter) {
        const query = this.hvacUnit.buildQuery();

        if (filter) {
            query.match('name', `*${filter}*`);
        }

        return query.limit(10).sort('name').query();
    }

    updateQueryParams(unitXid) {
        this.$state.go(
            '.',
            { ...this.$stateParams, xid: unitXid },
            { location: 'replace', notify: false }
        );
    }

    storeUnit() {
        this.localStorageService.set(STORAGE_KEY, this.unit);
    }

    unitUpdated() {
        this.setViewValue();
        this.storeUnit();
    }
}
export default {
    require: {
        ngModelCtrl: 'ngModel',
    },
    controller: UnitsSearchController,
    template,
};
