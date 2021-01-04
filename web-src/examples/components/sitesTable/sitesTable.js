/**
 * Copyright (C) 2020 RadixIot. All rights reserved.
 * @author Luis Güette
 */

import moment from 'moment';

import htmlTemplate from './sitesTable.html';
import './sitesTable.css';

class SitesTableController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['$state', 'exSite', 'localStorageService', 'maPoint'];
    }

    constructor($state, exSite, localStorageService, maPoint) {
        this.$state = $state;

        this.exSite = exSite;
        this.localStorageService = localStorageService;

        this.maPoint = maPoint;

        this.lastDayStart = moment().subtract(1, 'days').startOf('day');
        this.lastDayEnd = moment().subtract(1, 'days').endOf('day');

        // this.lastDayStart = moment().subtract(2, 'hours');
        // this.lastDayEnd = moment().subtract(1, 'hours');
    }

    $onInit() {
        this.getSites();
    }

    getSites(loadMore) {
        const builder = this.exSite.buildQuery();
        const offset = Array.isArray(this.sites) && loadMore ? this.sites.length : 0;

        return builder
            .sort('name')
            .limit(10, offset)
            .query()
            .then((sites) => {
                if (Array.isArray(this.sites) && loadMore) {
                    this.sites.push(...sites);
                    this.sites.$total = sites.$total;
                } else {
                    this.sites = sites;
                }
                return this.sites;
            });
    }

    onScroll(index, site, entry, intersectionSupported) {
        site.isIntersecting = !intersectionSupported || entry.isIntersecting;

        if (this.sites.length - 1 === index && entry.isIntersecting) {
            this.getSites(true);
        }
    }

    sitePointsLoading(site) {
        return !(
            site.isIntersecting
            && (!site.consumedEnergy || site.consumedEnergy.value != null)
            && (!site.currentPowerProduction || site.currentPowerProduction.value != null)
            && (!site.irradiance || site.irradiance.value != null)
            && (!site.heartbeat || site.heartbeat.value != null)
        );
    }
}

export default {
    bindings: {},
    controller: SitesTableController,
    template: htmlTemplate
};
