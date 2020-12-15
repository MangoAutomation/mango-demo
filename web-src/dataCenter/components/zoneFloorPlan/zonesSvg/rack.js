/*
 * Copyright (C) 2020 Infinite Automation Systems Inc. All rights reserved.
 */

rack.$inject = [];
function rack() {
    return {
        restrict: 'A',
        require: '^^dcZonesSvg',
        link: function ($scope, $element, $attrs, zonesSvgCtrl) {
            const details = zonesSvgCtrl.rackAndRowForPolygon($element[0]);

            $scope.$watch(
                () => {
                    return zonesSvgCtrl.polygonColor(details);
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

export default rack;
