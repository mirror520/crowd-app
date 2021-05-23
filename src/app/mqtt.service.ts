import { Injectable } from '@angular/core';
import { IMqttMessage, IMqttServiceOptions, MqttConnectionState, MqttService as Mqtt } from 'ngx-mqtt';
import { Observable } from 'rxjs';

import { MQTT_SERVICE_OPTIONS } from '../environments/environment';
import { User } from './model/user';

@Injectable({
  providedIn: 'root'
})
export class MqttService {
  currentUser: User;

  constructor(
    private mqttService: Mqtt
  ) { }

  connect(user: User): Observable<MqttConnectionState> {
    const options: IMqttServiceOptions = MQTT_SERVICE_OPTIONS;
    options.username = `mqtt:${user.username}`;
    options.password = user.password;

    this.mqttService.connect(options);

    return this.mqttService.state;
  }

  subscribeTopic(topic: string): Observable<IMqttMessage> {
    return this.mqttService.observe(topic, { qos: 2 });
  }

  publishMessage(message: string, topic: string) {
    this.mqttService.unsafePublish(
      topic, message, { qos: 2, retain: true }
    );

    console.log(`publish message: ${message} to topic: ${topic}`);
  }

  status(): Observable<MqttConnectionState> {
    return this.mqttService.state;
  }
}
