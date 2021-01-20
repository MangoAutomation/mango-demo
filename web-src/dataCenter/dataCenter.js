import angular from 'angular';

import './dataCenter.css';

import dataHallOverviewPage from './pages/dataHallOverview/dataHallOverview';

import pointSelectors from './components/pointSelectors/pointSelectors';
import expansionPanel from './components/expansionPanel/expansionPanel';
import activeAlarms from './components/activeAlarms/activeAlarms';
import statisticsWidget from './components/statisticsWidget/statisticsWidget';

import siteFloorPlan from './components/siteFloorPlan/siteFloorPlan';
import dataHallFloorPlan from './components/dataHallFloorPlan/dataHallFloorPlan';

import rackDirective from './components/dataHallFloorPlan/rack';

import utilFactory from './services/util';
import snowDataFactory from './services/snowData';

const dataCenterModule = angular.module('dataCenterModule', ['maUiApp'])
    .component('dcDataHallOverviewPage', dataHallOverviewPage)
    .component('dcPointSelectors', pointSelectors)
    .component('dcExpansionPanel', expansionPanel)
    .component('dcActiveAlarms', activeAlarms)
    .component('dcStatisticsWidget', statisticsWidget)
    .component('dcSiteFloorPlan', siteFloorPlan)
    .component('dcDataHallFloorPlan', dataHallFloorPlan)

    .directive('dcRack', rackDirective)

    .factory('dcUtil', utilFactory)
    .factory('dcSnowData', snowDataFactory);

dataCenterModule.config(['maUiMenuProvider', maUiMenuProvider => {
    'use strict';
    maUiMenuProvider.registerMenuItems([
        {
            url: '/data-center',
            name: 'ui.datacenter',
            menuIcon: 'fiber_manual_record',
            menuText: 'Data center',
            template: '<div flex="noshrink" layout="column" ui-view></div>',
            abstract: true,
            weight: 100,
        },
        {
            name: 'ui.datacenter.overview',
            url: '/overview',
            template: '<dc-data-hall-overview-page></dc-data-hall-overview-page>',
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
}]);

export default dataCenterModule;
