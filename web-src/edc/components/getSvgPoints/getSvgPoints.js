/**
 * Copyright (C) 2020 RadixIot. All rights reserved.
 * @author Pier Puccini
 */

import htmlTemplate from './getSvgPoints.html';
import './getSvgPoints.css';

const TAB_KEY = 'siteDetailsTab';
const SITE_KEY = 'siteXid';

const TEMPERATURE_NAMES = ['Cold Aisle 1 Temperature', 'Cold Aisle 2 Temperature', 'Cold Aisle Humidity', 'Hot Aisle 1 Temperature', 'Hot Aisle 2 Temperature'];
const RACK_NAMES = ['Load Percentage', 'kW Total'];

const HVAC_NAMES = ['Mode', 'mode'];

const TEMP_MAP = {
    'Cold Aisle 1 Temperature': 'coldA1',
    'Cold Aisle 2 Temperature': 'coldA2',
    'Cold Aisle Humidity': 'coldH',
    'Hot Aisle 1 Temperature': 'hotA1',
    'Hot Aisle 2 Temperature': 'hotA2'
};

const RACK_MAP = {
    'Load Percentage': 'loadPercent',
    'kW Total': 'load',
    Mode: 'mode'
};

const POWER_PATH_MAP = {
    'PDU Active': 'pduActive',
    'UPS Active': 'upsActive',
    'Contactor Position B0': 'b0Contact',
    'Contactor Position B1': 'b1Contact'
};

class GetSvgPointsController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['localStorageService', 'maPoint'];
    }

    constructor(localStorageService, maPoint) {
        this.localStorageService = localStorageService;

        this.maPoint = maPoint;
    }

    $onInit() {
        this.siteXid = '205588';
        this.tab = 'overview';
        this.storedItems = this.localStorageService.get(`${this.tab}Storage`);
        if (this.tab === 'pdu') {
            this.pdu = this.storedItems.pdu;
            this.equipmentType = 'PDU';
        }

        if (this.tab === 'overview' && this.powerPath === '') {
            this.equipmentType = ['Site', 'ATS'];
        }

        if (this.tab === 'overview' && this.siteView === '') {
            this.equipmentType = ['PDU', 'HVAC'];
        }
        this.getPoints();
    }

    getPoints() {
        const pointQuery = this.maPoint.buildQuery();

        pointQuery.in('tags.equipmentType', this.equipmentType).eq('tags.site', this.siteXid);

        if (this.tab === 'pdu') {
            pointQuery.eq('tags.pdu', this.pdu);
            pointQuery.eq('tags.outlet', this.outlet);
        }
        if (this.tab === 'overview' && this.siteView === '') {
            pointQuery.in('name', [...TEMPERATURE_NAMES, ...RACK_NAMES, ...HVAC_NAMES]);
        }

        pointQuery.query().then((points) => {
            let parsedPoints = null;
            if (this.tab === 'pdu') {
                parsedPoints = this.parseOutlets(points);
            }
            if (this.tab === 'overview' && this.powerPath === '') {
                parsedPoints = this.createPointMap(points, POWER_PATH_MAP);
            }
            if (this.tab === 'overview' && this.siteView === '') {
                parsedPoints = this.parseSiteView(points);
                this.site({ $site: this.siteXid });
            }
            this.points({ $p: parsedPoints });
        });
    }

    parseOutlets(array) {
        return array.reduce((result, point) => {
            if (point.tags.description === 'Name') {
                result.name = point;
            }
            if (point.tags.description === 'State') {
                result.state = point;
            }
            return result;
        }, {});
    }

    parseSiteView(array) {
        const pointsPerPdu = array.reduce((result, point) => {
            let key = 'temp';
            if (point.tags.pdu) {
                key = point.tags.pdu.replace('-', '').replace('_', '');
            }
            if (point.tags.hvac) {
                key = point.tags.hvac.replace('-', '').replace('_', '');
            }
            if (!result[key]) {
                result[key] = [];
            }

            result[key].push(point);
            return result;
        }, {});

        return Object.keys(pointsPerPdu).reduce((result, groupKey) => {
            const dictionary = groupKey === 'temp' ? TEMP_MAP : RACK_MAP;
            result[groupKey] = this.createPointMap(pointsPerPdu[groupKey], dictionary);
            return result;
        }, {});
    }

    createPointMap(array, dictionary) {
        return array.reduce((result, point) => {
            const shortName = dictionary[point.name];
            if (Object.keys(dictionary).includes(point.name)) {
                result[shortName] = point;
            }
            return result;
        }, {});
    }
}

export default {
    bindings: {
        points: '&',
        site: '&?',
        outlet: '@?',
        powerPath: '@?',
        siteView: '@?'
    },
    controller: GetSvgPointsController,
    template: htmlTemplate
};
