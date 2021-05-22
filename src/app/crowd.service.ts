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

          location[attr] = value.payload.toString();
        }

        return this.locations.filter(i => i !== null);
      })
    );
  }
}
