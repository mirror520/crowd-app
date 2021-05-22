import { Component, OnInit } from '@angular/core';

import { MqttService } from './mqtt.service';
import { User } from './model/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'crowd-app';
  user: User;

  constructor(
    private mqttService: MqttService
  ) {
    this.user = new User();
    this.user.username = 'username';
    this.user.password = 'password';
  }

  ngOnInit() {
    this.mqttService.connect(this.user).subscribe({
      next: (value) => console.log(`MQTT Service: ${value}`),
      error: (err) => console.error(err),
      complete: () => console.log('complete')
    });
  }
}
