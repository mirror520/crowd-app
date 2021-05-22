import { Component, OnInit } from '@angular/core';

import { MqttService } from './mqtt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'crowd-app';

  constructor(
    private mqttService: MqttService
  ) { }

  ngOnInit() {
    this.mqttService.connect().subscribe({
      next: (value) => console.log(`MQTT Service: ${value}`),
      error: (err) => console.error(err),
      complete: () => console.log('complete')
    });
  }
}
