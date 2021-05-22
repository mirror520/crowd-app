import { Injectable } from '@angular/core';
import { IMqttMessage, IMqttServiceOptions, MqttConnectionState, MqttService as Mqtt } from 'ngx-mqtt';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MQTT_SERVICE_OPTIONS } from '../environments/environment';
import { User } from './model/user';

@Injectable({
  providedIn: 'root'
})
export class MqttService {

  constructor(
    private mqttService: Mqtt
  ) { }

  connect(user: User): Observable<string> {
    const options: IMqttServiceOptions = MQTT_SERVICE_OPTIONS;
    options.username = `mqtt:${user.username}`;
    options.password = user.password;

    this.mqttService.connect(options);

    return this.getStatus();
  }

  subscribeTopic(topic: string): Observable<string> {
    return this.mqttService.observe(topic).pipe(
      map((message: IMqttMessage) => message.payload.toString())
    );
  }

  publishMessage(message: string, topic: string) {
    this.mqttService.unsafePublish(topic, message, { qos: 1, retain: true });
  }

  getStatus(): Observable<string> {
    return this.mqttService.state.pipe(
      map((status: MqttConnectionState) => MqttConnectionState[status])
    );
  }
}
