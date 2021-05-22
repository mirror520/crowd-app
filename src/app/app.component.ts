import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { MqttService } from './mqtt.service';
import { User } from './model/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'crowd-app';
  mqttSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private mqttService: MqttService
  ) {
    const user = new User();
    user.username = this.activatedRoute.snapshot.paramMap.get('username');
    user.password = this.activatedRoute.snapshot.paramMap.get('password');

    this.activatedRoute.queryParams.subscribe(params => {
      if (params['username'] && params['password']) {
        const user = new User();
        user.username = params['username'];
        user.password = params['password'];

        this.connectMqtt(user);
      }
    });
  }

  connectMqtt(user: User) {
    if (this.mqttSubscription) return;

    this.mqttSubscription = this.mqttService.connect(user).subscribe({
      next: (value) => console.log(`MQTT Service: ${value}`),
      error: (err) => console.error(err),
      complete: () => console.log('complete')
    });
  }
}
