import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MqttConnectionState } from 'ngx-mqtt';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

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
  view = [document.documentElement.clientWidth, 450];

  locations: Observable<Location[]>;
  location: Observable<Location>;
  mqttSubscription: Subscription;

  chartColors = { name: 'aqua', 
    domain: [
      '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da',
      '#00bcd4', '#00acc1', '#0097a7', '#00838f', '#006064'
    ]
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private crowdService: CrowdService,
    private mqttService: MqttService,
    private router: Router
  ) {
    fromEvent(window, 'resize').pipe(
      map(() => {
        let width = document.documentElement.clientWidth;
        let height = document.documentElement.clientHeight;
        return [width, (height <= 650) ? height - 150 : 450];
      }),
      debounceTime(200)
    ).subscribe(screen => this.view = screen);

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

      if (params['location']) {
        let lid = +params['location'];
        this.location = this.crowdService.getLocation(lid);
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

  changeLocationCode(code) {
    this.crowdService.updateCode(code);
  }

  addCurrent() {
    this.crowdService.addCurrent();
  }

  subCurrent() {
    this.crowdService.subCurrent();
  }

  get currentUser(): User {
    return this.mqttService.currentUser;
  }

  get locationCode(): string {
    return this.crowdService?.location?.code;
  }
}
