import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MqttConnectionState } from 'ngx-mqtt';

import { CrowdService } from '../crowd.service';
import { MqttService } from '../mqtt.service';
import { Location } from '../model/location';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  private _currentLocation: Location;

  locations: Location[];
  locationFormGroup: FormGroup;

  constructor(
    private crowdService: CrowdService,
    private formBuilder: FormBuilder,
    private mqttService: MqttService
  ) { }

  ngOnInit() {
    this.mqttService.status().subscribe({
      next: (value) => {
        if (value === MqttConnectionState.CONNECTED) {
          this.getLocations();
        }
      },
      error: (err) => console.error(err),
      complete: () => console.log('complete')
    });

    this.locationFormGroup = this.formBuilder.group({
      name: [], capacity: [], current: []
    });
  }

  getLocations() {
    this.crowdService.getLocations().subscribe({
      next: (value) => this.locations = value,
      error: (err) => console.error(err),
      complete: () => console.log('complete')
    });
  }

  get currentLocation(): Location {
    return this._currentLocation;
  }
  set currentLocation(value: Location) {
    this._currentLocation = value;

    this.locationFormGroup = this.formBuilder.group({
      name: [
        value.name,
        [ Validators.required ]
      ],
      capacity: [
        value.capacity,
        [ Validators.required, Validators.min(0) ] 
      ],
      current: [
        value.current,
        [ Validators.required, Validators.min(0) ]
      ]
    });
  }

  updateLocation(formGroup: FormGroup, currentLocation: Location) {
    const newLocation = formGroup.value;
    const diffKey = Object.keys(newLocation).filter(k => newLocation[k] !== currentLocation[k]);

    for (let key of diffKey) {
      let message = String(newLocation[key])
      this.crowdService.updateLocation(currentLocation, key, message);
    }
  }
}
