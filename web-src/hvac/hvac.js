import angular from 'angular';

import './hvac.css';

import overviewPage from './pages/overview/overview';
import alarmList from './components/alarmList/alarmList';
import energyChart from './components/energyChart/energyChart';
import kpiIndicators from './components/kpiIndicators/kpiIndicators';
import map from './components/map/map';
import selectedUnitCard from './components/selectedUnitCard/selectedUnitCard';
import unitsTable from './components/unitsTable/unitsTable';

import unitFactory from './services/unit';

const hvacModule = angular.module('hvacModule', ['maUiApp'])
    .component('hvacOverviewPage', overviewPage)
    .component('hvacMap', map)
    .component('hvacSelectedUnitCard', selectedUnitCard)
    .component('hvacUnitsTable', unitsTable)
    .component('hvacKpiIndicators', kpiIndicators)
    .component('hvacAlarmList', alarmList)
    .component('hvacEnergyChart', energyChart)

    .factory('hvacUnit', unitFactory)

hvacModule.config(['maUiMenuProvider', maUiMenuProvider => {
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
                    rollupControls: true
                }
            }
        },
    ]);
}])

export default hvacModule;
