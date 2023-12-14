import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css']
})
export class SensorComponent {
  @Input() temperatura_deseada : number = 0;
  @Input() mediciones: {temp: number, time: number}[] = [];
}
