import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MqttConnectionState } from 'ngx-mqtt';
import { Observable, Subscription } from 'rxjs';

import { CrowdService } from './crowd.service';
import { MqttService } from './mqtt.service';
import { Location } from './model/location';
import { User } from './model/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'crowd-app';
  connectionState = false;

  mqttSubscription: Subscription;
  locations: Observable<Location[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private crowdService: CrowdService,
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
      next: (value) => {
        console.log(`MQTT Service: ${MqttConnectionState[value]}`);
        
        this.connectionState = value === MqttConnectionState.CONNECTED;
        if (this.connectionState) {
          this.locations = this.crowdService.getLocations();
        }
      },
      error: (err) => console.error(err),
      complete: () => console.log('complete')
    });
  }

  save(location: Location) {
    console.log(location);
  }
}
