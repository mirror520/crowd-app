import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MqttConnectionState } from 'ngx-mqtt';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { CrowdService } from '../crowd.service';
import { MqttService } from '../mqtt.service';
import { Location } from '../model/location';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  lid: number;
  currentLocation: Location;
  view = [document.documentElement.clientWidth, 450];
  chartColors = { name: 'aqua', 
    domain: [
      '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da',
      '#00bcd4', '#00acc1', '#0097a7', '#00838f', '#006064'
    ]
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private crowdService: CrowdService,
    private mqttService: MqttService
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
      if (params['location']) {
        let location = params['location'];
        this.lid = +location;

        localStorage.setItem("location", location);
      }
    });
  }

  ngOnInit() {
    let width = document.documentElement.clientWidth;
    let height = document.documentElement.clientHeight;
    this.view = [width, (height <= 650) ? height - 150 : 450];

    this.mqttService.status().subscribe({
      next: (value) => {
        if (value === MqttConnectionState.CONNECTED) {
          if (!this.lid) {
            let location = localStorage.getItem("location");
            if (location) {
              this.lid = +location;
            }
          }

          this.getLocation(this.lid);
        }
      },
      error: (err) => console.error(err),
      complete: () => console.log('complete')
    });
  }

  getLocation(lid: number) {
    this.crowdService.getLocation(lid).subscribe({
      next: (value) => this.currentLocation = value,
      error: (err) => console.error(err),
      complete: () => console.log('complete')
    });
  }

  changeLocationCode(code) {
    this.crowdService.updateCode(this.currentLocation, code);
  }

  addCurrent() {
    this.crowdService.addCurrent(this.currentLocation);
  }

  subCurrent() {
    this.crowdService.subCurrent(this.currentLocation);
  }
}
