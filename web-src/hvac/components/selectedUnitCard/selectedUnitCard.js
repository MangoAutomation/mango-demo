/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Luis Güette
 */

import htmlTemplate from './selectedUnitcard.html';
import './selectedUnitCard.css';

import locationIcon from '../../assets/location.svg';

class SelectedUnitCardController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return [];
    }

    constructor() {
        this.locationIcon = locationIcon;
    }

    $onInit() {}
}

export default {
    bindings: {
        unit: '<?',
    },
    controller: SelectedUnitCardController,
    template: htmlTemplate,
};
