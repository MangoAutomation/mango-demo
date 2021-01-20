function rack() {
    'use strict';
    return {
        restrict: 'A',
        require: '^^dcDataHallFloorPlan',
        link: function ($scope, $element, $attrs, dataHallFloorPlanCtrl) {
            const details = dataHallFloorPlanCtrl.rackAndRowForPolygon($element[0]);

            $scope.$watch(
                () => {
                    return dataHallFloorPlanCtrl.polygonColor(details);
                },
                (currentClass, previousClass) => {
                    if (previousClass) {
                        $element.removeClass(previousClass);
                    }
                    $element.addClass(currentClass);
                }
            );
        }
    };
}
rack.$inject = [];

export default rack;
