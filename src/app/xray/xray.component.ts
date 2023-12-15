import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-xray',
  templateUrl: './xray.component.html',
  styleUrls: ['./xray.component.css']
})
export class XrayComponent {
  

  toggle_xray = false;

  @Input() 
  mediciones: 
    {
      temp: number, 
      time: number, 
      error : number,
      delta_error : number
    } [] = [];
}
