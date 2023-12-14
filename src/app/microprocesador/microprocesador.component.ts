import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-microprocesador',
  templateUrl: './microprocesador.component.html',
  styleUrls: ['./microprocesador.component.css']
})
export class MicroprocesadorComponent {

  @Output() accion = new EventEmitter<string>(); 
  @Input() temperatura_micro: number = 0;
  
  @Input() error : number = 0;
}
