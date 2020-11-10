// you can import libraries which are included in the UI module
//import d3 from 'd3';

import template from './template.html';
import './styles.css';

class ComponentController {
    static get $$ngIsClass() { return true; };
    static get $inject() { return ['$element', '$scope', 'testService']; };
    
    constructor($element, $scope, testService) {
        this.$element = $element;
        this.$scope = $scope;
        this.testService = testService;
        
        this.name = 'John';
    }
    
    $onChanges(changes) {
        if (changes.myAttribute) {
            this.doSomething();
        }
    }
    
    doSomething() {
    }
    
    useTheService() {
        this.message = this.testService.hello(this.name);
    }
}

export default {
    controller: ComponentController,
    template,
    bindings: {
        myAttribute: '<?'
    }
};