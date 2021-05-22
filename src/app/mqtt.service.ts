import { Injectable } from '@angular/core';
import { IMqttServiceOptions, MqttConnectionState, MqttService as Mqtt } from 'ngx-mqtt';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MQTT_SERVICE_OPTIONS } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MqttService {

  constructor(
    private mqttService: Mqtt
  ) { }

  connect(): Observable<string> {
    const options: IMqttServiceOptions = MQTT_SERVICE_OPTIONS;
    options.username = `mqtt:username`;
    options.password = 'password';

    this.mqttService.connect(options);

    return this.getStatus();
  }

  getStatus(): Observable<string> {
    return this.mqttService.state.pipe(
      map((status: MqttConnectionState) => MqttConnectionState[status])
    );
  }
}
