import angular from 'angular';

import './dataCenter.css';

import dataHallOverviewPage from './pages/dataHallOverview/dataHallOverview';

import breadCrumbs from './components/breadCrumbs/breadCrumbs';
import pointSelectors from './components/pointSelectors/pointSelectors';
import expansionPanel from './components/expansionPanel/expansionPanel';
import activeAlarms from './components/activeAlarms/activeAlarms';
import statisticsWidget from './components/statisticsWidget/statisticsWidget';

import siteFloorPlan from './components/siteFloorPlan/siteFloorPlan';

import zoneFloorPlan from './components/zoneFloorPlan/zoneFloorPlan';
import zonesSvg from './components/zoneFloorPlan/zonesSvg/zonesSvg';
import rack from './components/zoneFloorPlan/zonesSvg/rack';
import rowsLoads from './components/zoneFloorPlan/rowsLoads/rowsLoads';
import legend from './components/zoneFloorPlan/legend/legend';
import racksLoads from './components/zoneFloorPlan/racksLoads/racksLoads';
import environmental from './components/zoneFloorPlan/environmental/environmental';
import tabSum from './components/zoneFloorPlan/tapSum/tabSum';
import powerPath from './components/powerPath/powerPath';

import utilFactory from './services/util';
import snowDataFactory from './services/snowData';

const dataCenterModule = angular.module('dataCenterModule', ['maUiApp'])
    .component('dcDataHallOverviewPage', dataHallOverviewPage)
    .component('dcBreadCrumbs', breadCrumbs)
    .component('dcPointSelectors', pointSelectors)
    .component('dcExpansionPanel', expansionPanel)
    .component('dcActiveAlarms', activeAlarms)
    .component('dcStatisticsWidget', statisticsWidget)
    .component('dcSiteFloorPlan', siteFloorPlan)
    .component('dcZoneFloorPlan', zoneFloorPlan)
    .component('dcZonesSvg', zonesSvg)
    .directive('dcRack', rack)
    .component('dcRowsLoads', rowsLoads)
    .component('dcLegend', legend)
    .component('dcRacksLoads', racksLoads)
    .component('dcPowerPath', powerPath)
    .component('dcEnvironmental', environmental)
    .component('dcTabSum', tabSum)

    .factory('dcUtil', utilFactory)
    .factory('dcSnowData', snowDataFactory)

dataCenterModule.config(['maUiMenuProvider', maUiMenuProvider => {
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
}])

export default dataCenterModule;
