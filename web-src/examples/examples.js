import angular from 'angular';

import displayValuesPage from './pages/displayValues/displayValues';
import chartsPage from './pages/charts/charts';

// Components
import valueIndicator from './components/valueIndicator/valueIndicator';
import expansionPanel from './components/expansionPanel/expansionPanel';
import pointGroups from './components/pointGroups/pointGroups';
import pointsGroup from './components/pointGroups/pointsGroup/pointsGroup';
import statisticsChart from './components/statisticsChart/statisticsChart';

const examplesModule = angular.module('examplesModule', ['maUiApp'])
    .component('exDisplayValuesPage', displayValuesPage)
    .component('exChartsPage', chartsPage)

    .component('exValueIndicator', valueIndicator)
    .component('exExpansionPanel', expansionPanel)
    .component('exPointGroups', pointGroups)
    .component('exPointsGroup', pointsGroup)
    .component('exStatisticsChart', statisticsChart)

examplesModule.config(['maUiMenuProvider', maUiMenuProvider => {
    maUiMenuProvider.registerMenuItems([
        {
            url: '/ui-examples',
            name: 'ui.uiExamples',
            menuIcon: 'fiber_manual_record',
            menuText: 'UI Examples',
            template: '<div flex="noshrink" layout="column" ui-view></div>',
            abstract: true,
            weight: 900,
        },
        {
            name: 'ui.uiExamples.displayValues',
            url: '/display-values',
            template: '<ex-display-values-page></ex-display-values-page>',
            weight: 100,
            menuText: 'Display Values',
            menuIcon: 'font_download',
            params: {
                hideFooter: true,
                dateBar: {
                    rollupControls: true
                }
            }
        },
        {
            name: 'ui.uiExamples.charts',
            url: '/charts',
            template: '<ex-charts-page></ex-charts-page>',
            weight: 200,
            menuText: 'Charts',
            menuIcon: 'timeline',
            params: {
                hideFooter: true,
                dateBar: {
                    rollupControls: true
                }
            }
        },
    ]);
}])

export default examplesModule;
