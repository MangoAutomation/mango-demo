import angular from 'angular';

import overviewPage from './pages/overview/overview';
import unitDetailesPage from './pages/unitDetails/unitDetails';

import alarmList from './components/alarmList/alarmList';
import energyChart from './components/energyChart/energyChart';
import kpiIndicators from './components/kpiIndicators/kpiIndicators';
import map from './components/map/map';
import selectedUnitCard from './components/selectedUnitCard/selectedUnitCard';
import unitsTable from './components/unitsTable/unitsTable';
import unitsSearch from './components/unitSearch/unitsSearch';
import dataList from './components/dataList/dataList';

import unitFactory from './services/unit';

const hvacModule = angular
    .module('hvacModule', ['maUiApp'])
    .component('hvacOverviewPage', overviewPage)
    .component('hvacUnitDetailsPage', unitDetailesPage)

    .component('hvacMap', map)
    .component('hvacSelectedUnitCard', selectedUnitCard)
    .component('hvacUnitsTable', unitsTable)
    .component('hvacKpiIndicators', kpiIndicators)
    .component('hvacAlarmList', alarmList)
    .component('hvacEnergyChart', energyChart)
    .component('hvacUnitsSearch', unitsSearch)
    .component('hvacDataList', dataList)

    .factory('hvacUnit', unitFactory);

hvacModule.config([
    'maUiMenuProvider',
    (maUiMenuProvider) => {
        'use strict';
        maUiMenuProvider.registerMenuItems([
            {
                url: '/hvac',
                name: 'ui.hvac',
                menuIcon: 'fiber_manual_record',
                menuText: 'HVAC',
                template: '<div flex="noshrink" layout="column" ui-view></div>',
                abstract: true,
                weight: 100,
            },
            {
                name: 'ui.hvac.overview',
                url: '/overview',
                template: '<hvac-overview-page></hvac-overview-page>',
                weight: 100,
                menuText: 'Overview',
                menuIcon: 'public',
                params: {
                    hideFooter: true,
                    dateBar: {
                        rollupControls: true,
                    },
                },
            },
            {
                name: 'ui.hvac.unitDetails',
                url: '/unit-details?xid',
                template: '<hvac-unit-details-page></hvac-unit-details-page>',
                weight: 100,
                menuText: 'Unit Details',
                menuIcon: 'dns',
                params: {
                    hideFooter: true,
                    dateBar: {
                        rollupControls: true,
                    },
                },
            },
        ]);
    },
]);

export default hvacModule;
