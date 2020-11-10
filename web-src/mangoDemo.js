import angular from 'angular';

import edcModule from './edc/edgeDataCenter';

const userModule = angular.module('userModule', ['maUiApp', edcModule.name]);

export default userModule;
