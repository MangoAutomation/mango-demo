/**
 * Copyright (C) 2020 RadixIot. All rights reserved.
 * @author Luis Güette
 */
define([], function() {
    intersectionListenerDirective.$inject = ['$window'];
    function intersectionListenerDirective($window) {
        const supported = 'IntersectionObserver' in $window;

        class IntersectionListenerController {
            static get $inject() { return ['$scope', '$element']; }
            static get $$ngIsClass() { return true; }

            constructor($scope, $element) {
                this.$scope = $scope;
                this.$element = $element;
            }

            $onInit() {
                if (!supported) {
                    this.intersectionCallback({$intersectionSupported: supported});
                }

                this.observer.observe(this.$element[0], (entry) => {
                    this.$scope.$applyAsync(() => {
                        this.intersectionCallback({$entry: entry, $intersectionSupported: supported});
                    });
                });
            }

            $onDestroy() {
                this.observer.unobserve(this.$element[0]);
            }
        }

        return {
            restrict: 'A',
            require: {
                observer: '^^exIntersectionObserver'
            },
            scope: false,
            controller: IntersectionListenerController,
            bindToController: {
                intersectionCallback: '&exIntersectionListener'
            }
        };
    }

    return intersectionListenerDirective;
});
