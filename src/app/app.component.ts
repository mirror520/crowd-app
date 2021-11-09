import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MqttConnectionState } from 'ngx-mqtt';
import { Subscription } from 'rxjs';

import { CrowdService } from './crowd.service';
import { MqttService } from './mqtt.service';
import { User, UserRole } from './model/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'crowd-app';
  connectionState = false;
  isAdmin = false;
  view = [document.documentElement.clientWidth, 450];

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
    if ((this.mqttSubscription) && 
        (this.mqttService.currentUser?.username == user.username)) {
      return;
    };

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
    this.mqttService.subscribeTopic(`users/${user.username}/role`).subscribe({
      next: (value) => {
        switch (value.payload.toString()) {
          case 'admin':
            this.mqttService.currentUser.role = UserRole.Admin;
            this.isAdmin = true;
            this.router.navigate(['admin']);
            break;

          case 'user':
            this.mqttService.currentUser.role = UserRole.User;
            this.router.navigate(['']);
            break;
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
}
