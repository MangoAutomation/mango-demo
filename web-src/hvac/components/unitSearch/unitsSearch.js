/**
 * Copyright (C) 2021 RadixIot. All rights reserved.
 * @author Luis Güette
 */

import template from './unitsSearch.html';
import './unitsSearch.css';
import SearchController from '../../classes/SearchController';

const STORAGE_KEY = 'lastSelectedUnit';

class UnitsSearchController extends SearchController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['hvacUnit', 'localStorageService', '$stateParams', 'maDialogHelper', '$state'];
    }

    constructor(hvacUnit, localStorageService, $stateParams, maDialogHelper, $state) {
        super({
            hasStateParams: true,
            stateParamKey: 'xid',
            hasStoredValue: true,
            storageKey: STORAGE_KEY,
            $stateParams,
            maDialogHelper,
            $state,
            localStorageService,
        });

        this.hvacUnit = hvacUnit;
    }

    getItemByParamKeyValue(stateParamKeyValue) {
        return this.hvacUnit.get(stateParamKeyValue);
    }

    getItems(filter) {
        const query = this.hvacUnit.buildQuery();

        if (filter) {
            query.match('name', `*${filter}*`);
        }

        return query.limit(10).sort('name').query();
    }

    getItemStateParam(selectedItem) {
        return selectedItem.xid;
    }
}
export default {
    require: {
        ngModelCtrl: 'ngModel',
    },
    controller: UnitsSearchController,
    template,
};
