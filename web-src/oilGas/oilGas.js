import angular from 'angular';

import overviewPage from './pages/overviewPage/overviewPage';
import expansionPanel from './components/expansionPanel/expansionPanel';
import statisticsWidget from './components/statisticsWidget/statisticsWidget';
import eventsAndAlarms from './components/eventsAndAlarms/eventsAndAlarms';
import tankCards from './components/tankCards/tankCards';
import rssiIndicator from './components/rssiIndicator/rssiIndicator';
import infoCard from './components/infoCard/infoCard';

import siteFactory from './services/site';
import customerFactory from './services/customer';
import equipmentFactory from './services/equipment';

const oilGasModule = angular.module('oilGasModule', ['maUiApp'])
    .component('oilGasOverviewPage', overviewPage)
    .component('oilGasExpansionPanel', expansionPanel)
    .component('oilGasStatisticsWidget', statisticsWidget)
    .component('oilGasEventsAlarmsTable', eventsAndAlarms)
    .component('oilGasTankCards', tankCards)
    .component('oilGasRssiIndicator', rssiIndicator)
    .component('oilGasInfoCard', infoCard)

    .factory('oilGasCustomer', customerFactory)
    .factory('oilGasSite', siteFactory)
    .factory('oilGasEquipment', equipmentFactory)

oilGasModule.config(['maUiMenuProvider', maUiMenuProvider => {
    maUiMenuProvider.registerMenuItems([
        {
            url: '/oil-gas',
            name: 'ui.oilGas',
            menuIcon: 'fiber_manual_record',
            menuText: 'Oil & Gas',
            template: '<div flex="noshrink" layout="column" ui-view></div>',
            abstract: true,
            weight: 100,
        },
        {
            name: 'ui.oilGas.overview',
            url: '/overview',
            template: '<oil-gas-overview-page></oil-gas-overview-page>',
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

export default oilGasModule;
