/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Luis Güette
 */

utilFactory.$inject = ['$q', 'maDataPointTags', 'maPoint'];

function utilFactory($q, maDataPointTags, maPoint) {
    return Object.freeze({
        siteOptions() {
            return maDataPointTags
                .buildQuery('site')
                .ne('dataHall', null)
                .eq('equipmentType', 'DATA_HALL')
                .query();
        },

        dataHallOptions(site) {
            return maDataPointTags
                .buildQuery('dataHall')
                .eq('site', site)
                .eq('equipmentType', 'DATA_HALL')
                .query();
        },

        getSpecificPoints(searchOptions) {
            const { site, dataHall } = searchOptions;
            const pointQuery = maPoint.buildQuery();

            if (site) {
                pointQuery.eq('tags.site', site);
            }

            if (dataHall) {
                pointQuery.eq('tags.dataHall', dataHall);
            } else {
                pointQuery.eq('tags.equipmentType', 'DATA_HALL');
            }

            return pointQuery.limit(1000).query();
        },

        snakeToCamel(str) {
            return str.toLowerCase().replace(
                /([-_][a-z])/g,
                (group) => group.toUpperCase()
                                .replace('-', '')
                                .replace('_', '')
            );
        }
    });
}
export default utilFactory;
