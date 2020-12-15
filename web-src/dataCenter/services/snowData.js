/*
 * Copyright (C) 2020 Infinite Automation Systems Inc. All rights reserved.
 */

dcSnowDataFactory.$inject = ['maRestResource', 'maRqlBuilder'];
function dcSnowDataFactory(RestResource, RqlBuilder) {
    class DcSnowData extends RestResource {
        static get defaultProperties() {
            return {
                "region": null,
                "campus": null,
                "zone": null,
                "row": null,
                "rack": null,
                "rackClass": null,
                "rackType": null,
                "rackSku": null,
                "tcl": null,
                "hostsPerRack": null
            };
        }

        static get xidPrefix() {
            return '';
        }

        static get baseUrl() {
            return '/rest/latest/json/data/dc-dcim-snow-data';
        }

        static get webSocketUrl() {
            return '';
        }

        static http(httpConfig, opts = {}) {
            const {resourceMethod, saveType, originalId} = opts.resourceInfo || {};

            // override urls and methods
            switch (resourceMethod) {
                case 'query':
                    httpConfig.url = '/rest/latest/json/query/dc-dcim-snow-data';
                    break;
                case 'save':
                    httpConfig.method = 'POST';
                    httpConfig.url = `${this.baseUrl}/${this.encodeUriSegment(httpConfig.data.xid)}`;
                    break;
            }

            if (opts.timeout == null) {
                opts.timeout = 60 * 1000;
            }

            return super.http(httpConfig, opts).finally(result => {
                // delete old xid when updating to new xid
                if (resourceMethod === 'save' && saveType === 'update' && httpConfig.data.xid !== originalId) {
                    return this.http({
                        method: 'DELETE',
                        url: `${this.baseUrl}/${this.encodeUriSegment(originalId)}`
                    }).then(r => null, e => null);
                }
            });
        }

        static metrics(params, opts) {
            return this.http({
                url: '/rest/latest/dc/snow/metrics',
                params
            }, opts).then(r => r.data);
        }

        static rackClasses() {
            return this.rackInfo('/rest/latest/dc/snow/rack-classes');
        }

        static rackTypes() {
            return this.rackInfo('/rest/latest/dc/snow/rack-types');
        }

        static rackSkus() {
            return this.rackInfo('/rest/latest/dc/snow/rack-skus');
        }

        static rackInfo(url) {
            const builder = new RqlBuilder();
            builder.query = (opts) => {
                return this.http({
                    url,
                    params: {
                        rqlQuery: builder.build()
                    }
                }).then(r => r.data);
            };
            return builder;
        }
    }
    return DcSnowData;
}

export default dcSnowDataFactory;
