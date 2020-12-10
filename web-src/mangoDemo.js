import angular from 'angular';

import './mangoDemo.css';

import edcModule from './edc/edgeDataCenter';
import oilGasModule from './oilGas/oilGas';
import hvacModule from './hvac/hvac';
import dataCenter from './dataCenter/dataCenter';

const userModule = angular.module('userModule', [
    'maUiApp',
    edcModule.name,
    oilGasModule.name,
    hvacModule.name,
    dataCenter.name
]);

export default userModule;
