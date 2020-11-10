/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Luis Güette
 */

settingsFactory.$inject = ['maJsonStore'];
function settingsFactory(maJsonStore) {
    'use strict';

    const JSON_XID = 'edc-settings';

    class Settings {
        static get() {
            return maJsonStore.get({ xid: JSON_XID }).$promise.then((item) => item.jsonData);
        }
    }

    return Settings;
}

export default settingsFactory;
