class SearchController {
    static get $$ngIsClass() {
        return true;
    }

    constructor({
        hasStateParams = false,
        stateParamKey = 'xid',
        hasStoredValue = false,
        storageKey = 'lastStoredValue',
        $stateParams,
        maDialogHelper,
        $state,
        localStorageService,
    }) {
        this.hasStateParams = hasStateParams;
        this.stateParamKey = stateParamKey;
        this.hasStoredValue = hasStoredValue;
        this.storageKey = storageKey;

        this.$stateParams = $stateParams;
        this.maDialogHelper = maDialogHelper;
        this.$state = $state;
        this.localStorageService = localStorageService;
    }

    $onInit() {
        this.ngModelCtrl.$render = () => this.render();
        this.initValue = true;
    }

    /**
     * Depending on the selected options, this method initialize the selected value.
     * It should be used on $onInit
     */
    initializeValue() {
        if (this.hasStoredValue) {
            this.lastSelectedItem = this.localStorageService.get(this.storageKey);
        }

        if (this.hasStateParams && this.$stateParams[this.stateParamKey]) {
            this.getItemByParamKeyValue(this.$stateParams[this.stateParamKey]).then(
                (item) => {
                    this.selectedItem = item;
                    this.inputUpdated();
                },
                () => {
                    this.maDialogHelper.errorToast([
                        'literal',
                        `${this.$stateParams[this.stateParamKey]} not found`,
                    ]);
                    this.$state.go(this.$state.current.name, { [this.stateParamKey]: undefined });
                }
            );
        } else if (this.hasStoredValue && this.lastSelectedItem) {
            this.selectedItem = this.lastSelectedItem;
            this.setViewValue();
        } else {
            this.getItems().then((items) => {
                [this.selectedItem] = items;
                this.inputUpdated();
            });
        }
    }

    setViewValue() {
        this.ngModelCtrl.$setViewValue({ ...this.selectedItem });

        if (this.hasStateParams) {
            if (this.selectedItem) {
                this.updateStateParams(this.getItemStateParam(this.selectedItem));
            } else {
                this.updateStateParams(undefined);
            }
        }
    }

    render() {
        if (this.initValue) {
            this.initializeValue();
            this.initValue = false;
        } else {
            this.selectedItem = this.ngModelCtrl.$viewValue;
        }
    }

    /**
     * This method is used to get the selected item by the state param value.
     * You must implement it.
     *
     * @param {string} stateParamKeyValue
     */
    getItemByParamKeyValue(stateParamKeyValue) {}

    /**
     * This method is used to get the filtered items.
     * You must implement it.
     *
     * @param {string} filter
     */
    getItems(filter) {}

    /**
     * In this method you must provided the value used in the state params.
     * You must implement it.
     * @param {Object | string} selectedItem
     */
    getItemStateParam(selectedItem) {}

    updateStateParams(stateParamValue) {
        this.$state.go(
            '.',
            { ...this.$stateParams, [this.stateParamKey]: stateParamValue },
            { location: 'replace', notify: false }
        );
    }

    storeSelectedItem() {
        this.localStorageService.set(this.storageKey, this.selectedItem);
    }

    inputUpdated() {
        this.setViewValue();
        if (this.hasStoredValue) {
            this.storeSelectedItem();
        }
    }
}

export default SearchController;
