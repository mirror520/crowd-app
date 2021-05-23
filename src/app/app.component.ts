import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MqttConnectionState } from 'ngx-mqtt';
import { Subscription } from 'rxjs';

import { CrowdService } from './crowd.service';
import { MqttService } from './mqtt.service';
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private crowdService: CrowdService,
    private mqttService: MqttService,
    private router: Router
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      let username;
      let password;
      if (params['username'] && params['password']) {
        username = params['username'];
        password = params['password'];

        localStorage.clear();
      } else {
        username = localStorage.getItem("username");
        password = localStorage.getItem("password");
      }

      if (username && password) {
        const user = new User();
        user.username = username;
        user.password = password;

        this.connectMqtt(user);
      }
    });
  }

  connectMqtt(user: User) {
    if (this.mqttSubscription) {
      this.mqttSubscription.unsubscribe();
      this.mqttSubscription = null;
    }

    this.mqttSubscription = this.mqttService.connect(user).subscribe({
      next: (value) => {
        console.log(`MQTT Service: ${MqttConnectionState[value]}`);

        if (value === MqttConnectionState.CONNECTED) {
          this.connectionState = true;

          this.mqttService.currentUser = user;
          this.checkUserRole(user);

          localStorage.setItem("username", user.username);
          localStorage.setItem("password", user.password);
        }
      },
      error: (err) => console.error(err),
      complete: () => console.log('complete')
    });
  }

  checkUserRole(user: User) {
    this.mqttService.subscribeTopic(`users/${user.username}/admin`).subscribe({
      next: (value) => {
        if (value.payload.toString() === "true") {
          this.currentUser.isAdmin = true;
          this.router.navigate(['admin']);
        } else  {
          this.currentUser.isAdmin = false;
        }
      },
      error: (err) => console.error(err),
      complete: () => console.log('complete')
    });
  }

  addLocation() {
    this.crowdService.addLocation();
  }

  refreshLocations() {
    this.crowdService.refreshLocations();
  }

  get currentUser(): User {
    return this.mqttService.currentUser;
  }
}
