import angular from 'angular';

import './edgeDataCenter.css';

import overviewPage from './pages/overviewPage/overviewPage';
import expansionPanel from './components/expansionPanel/expansionPanel';
import siteInfo from './components/siteInfo/siteInfo';
import mainKpis from './components/mainKpis/mainKpis';
import powerPath from './components/powerPath/powerPath';
import siteView from './components/siteView/siteView';
import getSvgPoints from './components/getSvgPoints/getSvgPoints';
import activeAlarms from './components/activeAlarms/activeAlarms';
import statisticsWidget from './components/statisticsWidget/statisticsWidget';

import sitesFactory from './services/sites';
import settingsFactory from './services/settings';

const edcModule = angular.module('edcModule', ['maUiApp'])
    .component('edcOverviewPage', overviewPage)
    .component('edcExpansionPanel', expansionPanel)
    .component('edcSiteInfo', siteInfo)
    .component('edcMainKpis', mainKpis)
    .component('edcPowerPath', powerPath)
    .component('edcSiteView', siteView)
    .component('edcGetSvgPoints', getSvgPoints)
    .component('edcActiveAlarms', activeAlarms)
    .component('edcStatisticsWidget', statisticsWidget)

    .factory('edcSites', sitesFactory)
    .factory('edcSettings', settingsFactory)

edcModule.config(['maUiMenuProvider', maUiMenuProvider => {
    maUiMenuProvider.registerMenuItems([
        {
            url: '/edc',
            name: 'ui.edc',
            menuIcon: 'fiber_manual_record',
            menuText: 'Edge data center',
            template: '<div flex="noshrink" layout="column" ui-view></div>',
            abstract: true,
            weight: 100,
        },
        {
            name: 'ui.edc.overview',
            url: '/overview',
            template: '<edc-overview-page></edc-overview-page>',
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

export default edcModule;
