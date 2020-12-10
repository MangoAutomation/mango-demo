import angular from 'angular';

import './dataCenter.css';

import zoneOverviewPage from './pages/zoneOverview/zoneOverview';

const dataCenterModule = angular.module('dataCenterModule', ['maUiApp'])
    .component('dcZoneOverviewPage', zoneOverviewPage)

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
            template: '<dc-zone-overview-page></dc-zone-overview-page>',
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
