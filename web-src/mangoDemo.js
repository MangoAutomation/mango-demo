import angular from 'angular';

import edcModule from './edc/edgeDataCenter';
import oilGasModule from './oilGas/oilGas';

const userModule = angular.module('userModule', ['maUiApp', edcModule.name, oilGasModule.name]);

export default userModule;
