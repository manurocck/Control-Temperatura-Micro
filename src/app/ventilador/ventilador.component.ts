import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ventilador',
  templateUrl: './ventilador.component.html',
  styleUrls: ['./ventilador.component.css']
})
export class VentiladorComponent {
  @Input() velocidad_ventilador = 100;
  @Input() velocidad_anterior = 0;

  
  diferenciaVelocidades(){
    return this.velocidad_ventilador - this.velocidad_anterior;
  }
}
