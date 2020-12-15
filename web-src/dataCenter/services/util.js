/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Pier Puccini
 */

utilFactory.$inject = ['$q', 'maDataPointTags', 'maPoint'];

function utilFactory($q, maDataPointTags, maPoint) {
    return Object.freeze({
        regionOptions() {
            return maDataPointTags.values('region');
        },
        campusOptions(region) {
            return maDataPointTags.buildQuery('campus').ne('campus', null).eq('region', region).query();
        },
        zoneOptions(region, campus) {
            return maDataPointTags.buildQuery('zone').ne('zone', null).eq('region', region).eq('campus', campus).query();
        },
        rowOptions(region, campus, zone) {
            return maDataPointTags.buildQuery('row').ne('row', null).eq('region', region).eq('campus', campus).eq('zone', zone).query();
        },
        subRowOptions(region, campus, zone, row) {
            return maDataPointTags.buildQuery('subRow').ne('subRow', null).eq('region', region).eq('campus', campus).eq('zone', zone).eq('row', row).query();
        },
        bwOptions(region, campus, zone, row, subRow) {
            return maDataPointTags.buildQuery('busway').ne('busway', null).eq('region', region).eq('campus', campus).eq('zone', zone).eq('row', row).eq('subRow', subRow).query();
        },
        rackOptions(region, campus, zone, row, subRow, busway) {
            return maDataPointTags
                .buildQuery('rack')
                .ne('rack', null)
                .eq('region', region)
                .eq('campus', campus)
                .eq('zone', zone)
                .eq('row', row)
                .eq('subRow', subRow)
                .eq('subRow', subRow)
                .eq('busway', busway)
                .query();
        },
        tbOptions(region, campus, zone, row, subRow, busway, rack) {
            return maDataPointTags
                .buildQuery('tapbox')
                .ne('tapbox', null)
                .eq('region', region)
                .eq('campus', campus)
                .eq('zone', zone)
                .eq('row', row)
                .eq('subRow', subRow)
                .eq('busway', busway)
                .eq('rack', rack)
                .query();
        },
        cbOptions(region, campus, zone, row, subRow, busway, rack, tb) {
            return maDataPointTags
                .buildQuery('circuitBreaker')
                .ne('circuitBreaker', null)
                .eq('region', region)
                .eq('campus', campus)
                .eq('zone', zone)
                .eq('row', row)
                .eq('subRow', subRow)
                .eq('busway', busway)
                .eq('rack', rack)
                .eq('tapbox', tb)
                .query();
        },
        findDirectChildren(parent) {
            if (parent.toLowerCase() === 'region') {
                return ['Campus', 'Zone', 'Row', 'Asset'];
            }
            if (parent.toLowerCase() === 'campus') {
                return ['Zone', 'Row', 'Asset'];
            }
            if (parent.toLowerCase() === 'zone') {
                return ['Row', 'Asset'];
            }
            if (parent.toLowerCase() === 'zone') {
                return ['Asset'];
            }
            return null;
        },
        findChildObj(parentOptions) {
            const { region, campus, zone, row } = parentOptions;
            if (region === 'Global') {
                return {
                    parent: 'global',
                    parentValue: region,
                    child: 'Region'
                };
            }
            if (region !== 'Global' && !campus) {
                return {
                    parent: 'region',
                    parentValue: region,
                    child: 'Campus'
                };
            }
            if (campus && !zone) {
                return {
                    parent: 'campus',
                    parentValue: campus,
                    child: 'Zone'
                };
            }
            if (zone && !row) {
                return {
                    parent: 'zone',
                    parentValue: zone,
                    child: 'Row'
                };
            }
            if (row) {
                return {
                    parent: 'row',
                    parentValue: row,
                    child: 'Asset'
                };
            }
            return null;
        },
        getChildrenPoints(child, pointName, parentOrChild = 'child') {
            const pointQuery = maPoint.buildQuery();

            if (child.parent !== 'global' || parentOrChild === 'parent') {
                pointQuery.eq(`tags.${child.parent}`, child.parentValue);
            }

            if (pointName) {
                pointQuery.eq('name', pointName);
            }

            if (parentOrChild === 'child') {
                pointQuery.eq('tags.equipmentType', child.child);
            } else {
                pointQuery.eq('tags.equipmentType', child.parent);
            }

            return pointQuery.limit(10000).query();
        },

        getMultipleEquipmentPoints(equipmentArray, parentOptions, names, queryOn, additionalOptions = {}) {
            const { region, campus, zone } = parentOptions;
            const additionalOptionsKeys = Object.keys(additionalOptions);
            const pointQuery = maPoint.buildQuery();

            if (region) {
                pointQuery.eq('tags.region', region);
            }

            if (campus) {
                pointQuery.eq('tags.campus', campus);
            }

            if (zone) {
                pointQuery.eq('tags.zone', zone);
            }

            if (additionalOptionsKeys.length > 0) {
                additionalOptionsKeys.forEach((option) => {
                    pointQuery.eq(`tags.${option}`, additionalOptions[option]);
                });
            }

            if (names.length > 0) {
                pointQuery.in('name', names);
            }

            if (queryOn) {
                switch (queryOn) {
                    case 'region':
                        if (region) {
                            return pointQuery.in('tags.equipmentType', equipmentArray).limit(10000).query();
                        }
                        break;
                    case 'campus':
                        if (campus) {
                            return pointQuery.in('tags.equipmentType', equipmentArray).limit(10000).query();
                        }
                        break;
                    case 'zone':
                        if (zone) {
                            return pointQuery.in('tags.equipmentType', equipmentArray).limit(10000).query();
                        }
                        break;
                    default:
                        break;
                }
            }
            return pointQuery.in('tags.equipmentType', equipmentArray).limit(10000).query();
        },
        getSpecificPoints(searchOptions, isZoneView, isAssetView, doQuery = true) {
            let specificEquipmentType;
            const { region, campus, zone, row, subRow, busway, rack, tb, cb } = searchOptions;
            const pointQuery = maPoint.buildQuery();

            if (region) {
                specificEquipmentType = region === 'Global' ? 'Global' : 'Region';
                pointQuery.eq('tags.region', region === 'Global' ? null : region);
            }

            if (campus) {
                specificEquipmentType = 'Campus';
                pointQuery.eq('tags.campus', campus);
            }

            if (zone) {
                specificEquipmentType = 'Zone';
                pointQuery.eq('tags.zone', zone);
            }

            if (isAssetView && row) {
                specificEquipmentType = null;
                pointQuery.eq('tags.row', row);
            }

            if (isAssetView && subRow) {
                specificEquipmentType = 'Sub Row';
                pointQuery.eq('tags.subRow', subRow);
            }

            if (isAssetView && busway && !rack) {
                specificEquipmentType = 'Busway';
                pointQuery.eq('tags.busway', busway);
            }

            if (isAssetView && rack) {
                specificEquipmentType = 'Rack';
                pointQuery.eq('tags.rack', rack);
            }

            if (isAssetView && tb) {
                specificEquipmentType = 'Circuit Breaker';
                pointQuery.eq('tags.tapbox', tb);
                pointQuery.eq('tags.busway', busway);
            }

            if (isAssetView && cb) {
                specificEquipmentType = 'Circuit Breaker';
                pointQuery.eq('tags.circuitBreaker', cb);
                pointQuery.eq('tags.busway', busway);
            }

            if (specificEquipmentType) {
                pointQuery.eq('tags.equipmentType', specificEquipmentType);
            }

            if (doQuery) {
                return pointQuery.limit(1000).query();
            }
            return $q.reject([]);
        },
        getCapacityPoint(searchOptions) {
            let pointName;
            let specificEquipmentType;
            const { region, campus, zone, row, busway, rack, tb, cb } = searchOptions;
            const pointQuery = maPoint.buildQuery();
            if (row || busway) {
                pointName = row !== '09' ? 'Busway Capacity' : 'Network Busway Capacity';
                specificEquipmentType = 'Zone';
            }

            if (rack) {
                pointName = 'Rack Capacity';
                specificEquipmentType = 'Zone';
            }

            if (tb) {
                pointName = 'Breaker Capacity';
                specificEquipmentType = 'Zone';
            }

            if (cb) {
                pointName = 'Breaker Capacity';
                specificEquipmentType = 'Zone';
            }

            if (specificEquipmentType) {
                pointQuery.eq('tags.equipmentType', specificEquipmentType);
            }

            return pointQuery.eq('tags.region', region).eq('tags.campus', campus).eq('tags.zone', zone).eq('name', pointName).limit(1000).query();
        }
    });
}
export default utilFactory;
