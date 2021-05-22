import { IMqttServiceOptions } from 'ngx-mqtt';

export const environment = {
  production: true
};

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'mqtt.tccgov.tw',
  port: 443,
  protocol: 'wss',
  connectOnCreate: false
};
