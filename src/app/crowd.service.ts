import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';

import { MqttService } from './mqtt.service';
import { Location } from './model/location';
import { IMqttMessage } from 'ngx-mqtt';

@Injectable({
  providedIn: 'root'
})
export class CrowdService {
  private topicCheck = new RegExp('^locations\/(?<lid>.{0,})\/(?<attr>.{0,})');

  locations: Location[] = Array();
  location: Location;
  count: number = 0;

  constructor(
    private mqttService: MqttService
  ) { }

  getLocations(): Observable<Location[]> {
    return this.mqttService.subscribeTopic(`locations/#`).pipe(
      retry(),
      map((value: IMqttMessage) => {
        const match = value.topic.match(this.topicCheck);
        if (match) {
          const lid = match.groups?.lid;
          const attr = match.groups?.attr;

          let location = new Location();
          location.id = +lid;
          if (lid in this.locations) {
            location = this.locations[lid];
          } else {
            this.locations[lid] = location;
          }

          const message = value.payload.toString();
          location.updateFromTopic(attr, message);
        } else {
          if (value.topic == 'locations/count') {
            this.count = +value.payload.toString();
          }
        }

        return this.locations.filter(i => i !== null);
      })
    );
  }

  getLocation(lid: number): Observable<Location> {
    return this.mqttService.subscribeTopic(`locations/${lid}/#`).pipe(
      retry(),
      map((value: IMqttMessage) => {
        const match = value.topic.match(this.topicCheck);
        if (match) {
          const lid = match.groups?.lid;
          const attr = match.groups?.attr;
          const message = value.payload.toString();

          if (!this.location) {
            this.location = new Location();
            this.location.id = +lid;
          }

          this.location.updateFromTopic(attr, message);
        }

        return this.location;
      })
    );
  }

  addLocation() {
    let count = this.count + 1;
    let topic = `locations/count`;
    this.mqttService.publishMessage(String(count), topic);

    this.mqttService.publishMessage('新的地點', `locations/${count}/name`);
    this.mqttService.publishMessage('0', `locations/${count}/capacity`);
    this.mqttService.publishMessage('0', `locations/${count}/current`);
  }

  updateLocation(location: Location, key: string, value: string) {
    let topic = `locations/${location.id}/${key}`;
    let message = value;
    this.mqttService.publishMessage(message, topic);
  }

  updateCode(code: string) {
    this.updateLocation(this.location, 'code', code);
  }

  addCurrent() {
    let current = this.location.current + 1;
    this.updateLocation(this.location, 'current', String(current));
  }

  subCurrent() {
    let current = this.location.current - 1;
    this.updateLocation(this.location, 'current', String(current));
  }

  refreshLocations() {
    const message = String(0);
    for (let location of this.locations) {
      if (!location) continue;

      let topic = `locations/${location.id}/current`;
      this.mqttService.publishMessage(message, topic);
    }
  }
}
