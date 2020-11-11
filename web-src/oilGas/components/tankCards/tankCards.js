/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Pier Puccini
 */

import stallionTankCards from './tankCards.html';
import './tankCards.css';

import tankSvg from './assets/tankSvg.svg';
import tankPng from './assets/tankSvg-image.png';

import rectTankSvg from './assets/rectTank.svg';
import steppedTankSvg from './assets/steppedTank.svg';
import cylindricalTankSvg from './assets/cylindricalTank.svg';

class StallionTankCardsController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['maEvents', 'maDialogHelper'];
    }

    constructor(Events, maDialogHelper) {
        this.maDialogHelper = maDialogHelper;
        this.Events = Events;
        this.tankSvg = tankSvg;
        this.tankPng = tankPng;
        this.rectTankSvg = rectTankSvg;
        this.steppedTankSvg = steppedTankSvg;
        this.cylindricalTankSvg = cylindricalTankSvg;

        this.query = {
            limit: 15,
            page: 1,
            total: 0
        };
    }

    $onInit() {}

    $onChanges(changes) {
        if (changes.sensors && changes.sensors.currentValue) {
            this.tankSensors = this.sensors.filter(
                (sensor) => sensor.data.key !== 'displayOnly'
            );
            this.sensorsCopy = angular.copy(this.tankSensors);
            this.query.total = this.sensorsCopy.length;
            if (this.type === 'overview') {
                this.attachSensorAlarms();
            }
            this.attachUnitType();
        }
    }

    attachSensorAlarms() {
        this.tankSensors.forEach((tank) => {
            if (tank.activeEvents) {
                tank.activeEvents.deregister();
            }
            const dataPointIds = tank.pointIds;
            tank.activeEvents = this.Events.notificationManager
                .buildActiveQuery()
                .eq('eventType.eventType', 'DATA_POINT')
                .in('eventType.referenceId1', dataPointIds)
                .activeEvents();
        });
    }

    svgTankPercent(fluid, limit, level) {
        let result = '';
        if (this.sensors) {
            const [tank] = this.sensors.filter(
                (sensor) => sensor.data.key === fluid
            );
            if (tank) {
                const { points, data } = tank;
                if (points && points.volume && data.capacity && !level) {
                    result = Math.ceil(
                        (points.volume.value / data.capacity) * 100
                    );
                    result = limit >= result && result > limit - 10;
                } else if (points && points.level.value && level) {
                    result = `${points.level.renderedValue}`;
                }
            }
        }
        return result;
    }

    attachUnitType() {
        this.tankSensors.forEach((tank) => {
            tank.unitType = tank.barrels ? 'bbl' : 'gal';
        });
    }

    openDetectorDialog(sensor) {
        this.selectedSensor = sensor;
        this.showSensorDialog = true;
    }

    sensorDialogHidden() {
        this.showSensorDialog = false;
    }

    sensorDialogCancelled() {
        this.showSensorDialog = false;
    }

    saveSensor() {
        this.sensor
            .save()
            .then(() => {
                this.dialog.hide();
                this.maDialogHelper.toastOptions({
                    text: 'Saved sensor successfully.'
                });
            })
            .catch((error) => {
                this.maDialogHelper.toastOptions({
                    text: `Error saving sensor - ${error.mangoStatusText}`,
                    hideDelay: 10000,
                    classes: 'md-warn'
                });
            });
    }
}

export default {
    bindings: {
        type: '@',
        sensors: '<'
    },
    controller: StallionTankCardsController,
    template: stallionTankCards
};
