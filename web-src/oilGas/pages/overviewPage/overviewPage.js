/**
 * Copyright (C) 2020 RadixIot. All rights reserved.
 * @author Luis Güette
 */

import htmlTemplate from './overviewPage.html';
import './overviewPage.css';

import weatherIcon from '../../assets/weather-icon.svg';
import windIcon from '../../assets/wind.svg';

import dropSvg from '../../assets/fresh-water-available.svg';
import alarmSvg from '../../assets/alarm.svg';

const SITE_POINTS_MAP = {
    'Total Stored Fluid': 'totalStoredFluid'
}

const EQUIPMENT_POINTS_MAP = {
    'Connected': 'connected',
    'rssi': 'rssi',
    'Uptime': 'uptime',
    'Last Update': 'lastUpdate'
}

const SENSOR_POINTS_MAP = {
    'Level': 'level',
    'Water Available': 'volume',
    'Battery Voltage': 'battery',
    'rssi': 'rssi',
    'Sensor Voltage': 'sensorVoltage'
}

class OverviewController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['oilGasCustomer', 'oilGasSite', 'oilGasEquipment', 'maPoint'];
    }

    constructor(oilGasCustomer, oilGasSite, oilGasEquipment, maPoint) {
        this.oilGasCustomer = oilGasCustomer;
        this.oilGasSite = oilGasSite;
        this.oilGasEquipment = oilGasEquipment;
        this.maPoint = maPoint;

        this.weatherIcon = weatherIcon;
        this.windIcon = windIcon;
        this.dropSvg = dropSvg;
        this.alarmSvg = alarmSvg;
    }

    $onInit() {
        this.getCustomers()
            .then((customers) => {
                this.customers = customers;
                [this.selectedCustomer] = this.customers;
            }).then(() => this.customerChanged());
    }

    getCustomers() {
        return this.oilGasCustomer.list();
    }

    customerChanged() {
        this.getSites().then(sites => {
            this.sites = sites;
            [this.selectedSite] = this.sites;
        }).then(() => this.siteChanged());
    }

    getSites() {
        return this.oilGasSite
            .buildQuery()
            .eq('customerXid', this.selectedCustomer.xid)
            .query();
    }

    siteChanged() {
        this.getSitePoints();
        this.getEquipments().then(equipments => {
            this.equipments = equipments;
            [this.selectedEquipment] = this.equipments;
        }).then(() => this.equipmentChanged())
    }

    getSitePoints() {
        return this.maPoint
            .buildQuery()
            .eq('tags.siteXid', this.selectedSite.xid)
            .query()
            .then(points => {
                this.selectedSite.points = points.reduce((result, point) => {
                    if (SITE_POINTS_MAP[point.name]) {
                        result[SITE_POINTS_MAP[point.name]] = point;
                    }
                    return result;
                }, {});
            });
    }

    getEquipments() {
        return this.oilGasEquipment
            .buildQuery()
            .eq('siteXid', this.selectedSite.xid)
            .query();
    }

    equipmentChanged() {
        this.getEquipmentPoints()
        this.getSensors();
    }

    getEquipmentPoints() {
        return this.maPoint
            .buildQuery()
            .eq('tags.equipmentXid', this.selectedEquipment.xid)
            .query()
            .then(points => {
                this.selectedEquipment.points = points.reduce((result, point) => {
                    if (EQUIPMENT_POINTS_MAP[point.name]) {
                        result[EQUIPMENT_POINTS_MAP[point.name]] = point;
                    }
                    return result;
                }, {});
            });
    }

    getSensors() {
        this.sensors = this.selectedEquipment.sensors;
        [this.selectedSensor] = this.sensors;
        this.sensorChanged();
    }

    sensorChanged() {
        return this.maPoint
            .buildQuery()
            .eq('tags.sensorXid', this.selectedSensor.xid)
            .query()
            .then(points => {
                this.selectedSensor.points = points.reduce((result, point) => {
                    if (SENSOR_POINTS_MAP[point.name]) {
                        result[SENSOR_POINTS_MAP[point.name]] = point;
                    }
                    return result;
                }, {});

            });
    }

    parseLocation(lat, lng) {
        let renderedLat = '';
        let renderedLng = '';
        let renderedLocation = '–';
        if (lat != null || lng != null) {
            if (lat < 0) {
                renderedLat = `${(parseFloat(lat) * -1).toFixed(3)}° S`;
            } else {
                renderedLat = `${parseFloat(lat).toFixed(3)}° N`;
            }
            if (lng < 0) {
                renderedLng = `${(parseFloat(lng) * -1).toFixed(3)}° W`;
            } else {
                renderedLng = `${(parseFloat(lng) * -1).toFixed(3)}° E`;
            }
            renderedLocation = `${renderedLng}, ${renderedLat}`;
        }
        return renderedLocation;
    }

    calculatePercentage(statsObj, type) {
        let percent = 0;
        if (statsObj != null && type !== 'level') {
            [percent] = statsObj[type].value.split(
                'gal'
            );
            percent = (percent / this.selectedSensor.data.capacity) * 100;
        }
        if (this.selectedSensor == null) {
            return null;
        }
        return `${percent.toFixed(2)} %`;
    }
}

export default {
    bindings: {},
    controller: OverviewController,
    template: htmlTemplate
};
