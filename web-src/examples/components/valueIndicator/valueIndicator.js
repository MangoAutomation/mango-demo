/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Luis Güette
 */

import htmlTemplate from './valueIndicator.html';
import './valueIndicator.css';

class ValueIndicatorController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return [];
    }
}

export default {
    bindings: {
        titleTr: '@',
        title: '@',
        value: '<',
        isPoint: '<',
        usePointName: '<?'
    },
    controller: ValueIndicatorController,
    template: htmlTemplate
};
