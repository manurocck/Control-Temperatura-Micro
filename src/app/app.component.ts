import { Component } from '@angular/core';
import { sleep } from './utils/utils';
import { ApiTemperaturaService } from './api-temperatura.service';

const TABLE_MAX_SIZE = 5;
const TEMP_ACTIV_VENTILADORES = 30;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private api_temp : ApiTemperaturaService){ }
  ngOnInit() {
    this.run(0);
  }
  
  title = 'Control de Temperatura';

  // Variables de simulacion
  timer = 0; 
  deltaTimer = 500;
  
  // Variables de control
  temperatura_deseada: number = 30;
  
  // Variables de estado
  temperatura_micro: number = this.api_temp.get();
  velocidad_ventilador: number = 0; //de 0 a 100
  mediciones: {temp: number, time: number, error : number}[] = [];
  
  // Variables auxiliares
  sumatoria_errores: number = 0;
  sumatoria_temperaturas : number = 0;
  velocidad_anterior : number = 0;


  async run( contador : number ) {
    this.simularEfectoVentilador(); //temperatura(velocidad) = -0,0002*velocidad^2
    this.simularCalentamientoMicro();
    // console.log("Corrida n°"+contador);
    this.realizarMedicion();

    if(this.timer%(10*this.deltaTimer) == 0){
      this.ajustarVentilador();
    }


    await this.aumentarClock();
    
    this.run(contador+1);
    return;
  }

  async aumentarClock() {
    if(this.timer > 100000){
      this.timer = 0;
    }
    this.timer+=this.deltaTimer;
    await sleep(this.deltaTimer);
  }


  realizarMedicion() {
    //Agregamos un error de +- 0.5 a la medicion
    let error = Math.random()-0.5;

    if(this.mediciones.length > TABLE_MAX_SIZE){
      let ultimaMedicion = this.mediciones.pop();
      if (ultimaMedicion){
        this.sumatoria_errores      -= ultimaMedicion.error;
        this.sumatoria_temperaturas -= ultimaMedicion.temp;
      }
    }
    this.mediciones.unshift({temp : this.api_temp.get()+error, time : this.timer/1000, error: this.api_temp.get()+error-this.temperatura_deseada});
    this.sumatoria_errores      += this.mediciones[0].error;
    this.sumatoria_temperaturas += this.mediciones[0].temp;

    // Temperatura real
    this.temperatura_micro = this.api_temp.get();
  }

  ajustarVentilador() {
    this.velocidad_anterior=this.velocidad_ventilador;
    // solo se ajusta si la temperatura promedio de las ultimas 5 mediciones es mayor a 35°C
    let promedio_temperaturas = this.sumatoria_temperaturas/this.mediciones.length;
    if(promedio_temperaturas-this.temperatura_deseada<3) {
      this.velocidad_ventilador = 0;
      return;
    }
    
    // Control proporcional
    let Kp = (promedio_temperaturas-this.temperatura_deseada>5)? 1 : 0;
    
    // Control integral
    let Ki = (this.sumatoria_errores>0)? 0.3 : 0; //considerando 10dt en 1 t del controlador (ventilador)

    // if(this.mediciones[0].error<10) Kp = 0;

    this.velocidad_ventilador = Kp * this.sumatoria_temperaturas/this.mediciones.length + Ki * this.sumatoria_errores;
    if(this.velocidad_ventilador<0){
      this.velocidad_ventilador = 0;
    }else{
      console.log("Aporte proporcional : "  +Kp * this.sumatoria_temperaturas/this.mediciones.length);
      console.log("Aporte integral : "      +Ki * this.sumatoria_errores);
    }
  }

  async simularEfectoVentilador() {
    await this.api_temp.aumentar(-(0.0002 * this.velocidad_ventilador*this.velocidad_ventilador));
  }
  async simularCalentamientoMicro() {
    if(this.temperatura_micro<this.temperatura_deseada)
      await this.api_temp.aumentar(0.1);
  }


  evento_micro(evento: string) {
    switch(evento){
      case '70':
        this.api_temp.set(70);
        break;
      case 'lento':
        this.calentar_micro(0.5);
        break;
      case 'rapido':
        this.calentar_micro(3);
        break;
    }
  }

  async calentar_micro(salto : number){
    await this.api_temp.aumentar(salto);
    await sleep(1500);
    this.calentar_micro(salto);
  }
}
