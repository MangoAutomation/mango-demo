/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Luis Güette
 */

unitFactory.$inject = ['maRestResource'];
function unitFactory(RestResource) {
    'use strict';

    const JSON_STORE_XID = 'hvac-units';

    class Site extends RestResource {
        static get defaultProperties() {
            return {};
        }

        static get baseUrl() {
            return `/rest/latest/json/data/${JSON_STORE_XID}`;
        }

        static get webSocketUrl() {
            return '';
        }

        static get xidPrefix() {
            return 'site-';
        }

        static http(httpConfig, opts = {}) {
            const { resourceMethod, saveType, originalId } = opts.resourceInfo || {};

            // override urls and methods
            switch (resourceMethod) {
                case 'query':
                    httpConfig.url = `/rest/latest/json/query/${JSON_STORE_XID}`;
                    break;
                case 'save':
                    httpConfig.method = 'POST';
                    httpConfig.url = `${this.baseUrl}/${this.encodeUriSegment(httpConfig.data.xid)}`;
                    break;
                default:
                    break;
            }

            return super.http(httpConfig, opts).finally(() => {
                // delete old xid when updating to new xid
                if (resourceMethod === 'save' && saveType === 'update' && httpConfig.data.xid !== originalId) {
                    return this.http({
                        method: 'DELETE',
                        url: `${this.baseUrl}/${this.encodeUriSegment(originalId)}`
                    }).then(
                        () => null,
                        () => null
                    );
                }
            });
        }
    }

    return Site;
}

export default unitFactory;
