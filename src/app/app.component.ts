import { Component } from '@angular/core';
import { sleep } from './utils/utils';
import { ApiTemperaturaService } from './api-temperatura.service';

const MAX_MEDICIONES_GUARDADAS = 5;
const MAX_VELOCIDAD_VENTILADOR  = 200;  // Velocidad máxima del ventilador
const TEMPERATURA_AMBIENTE      = 25;   // Temperatura ambiente (en °C)


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
  
  title = 'Simulación de Control de Temperatura';

  // Variables de simulacion
  timer = 0; 
  deltaTimer = 500;
  deltaVentilador = 5 * this.deltaTimer;
  
  // Variables de control
  temperatura_deseada   : number = 30;
  
  // Variables de estado
  temperatura_micro     : number = this.api_temp.get();
  velocidad_ventilador  : number = 0; // de 0 a 200 aprox

  // Variables de escenario
  procesos_activos      : number = 0; // Auxiliar para simular el calentamiento del micro
  
  // Variables auxiliares
  sumatoria_errores         : number = 0;
  sumatoria_temperaturas    : number = 0;
  promedio_errores_anterior : number = 0;
  velocidad_anterior        : number = 0;
  mediciones: 
    {
      temp: number, 
      time: number, 
      error : number,
      delta_error : number
    } [] = [];

  // Función principal de la simulación
  async run( contador : number ) {
    await this.aumentarClock();

    // Enfría el micro con el ventilador (si es necesario)
    this.simularEfectoVentilador();   

    // Calientamiento normal del micro (hasta temperatura ambiente a 0.1°C por unidad de tiempo) 
    this.simularCalentamientoMicro(TEMPERATURA_AMBIENTE, 0.1); 

    // Calentamiento del micro por apps abiertas
    this.simularCalentamientoMicro(TEMPERATURA_AMBIENTE + this.procesos_activos * 5, 0.05 * this.procesos_activos);

    // Realiza la medición de la temperatura con un sensor
    this.realizarMedicion();          

    // Ajusta la velocidad del ventilador con un controlador PID
    if(this.timer%(this.deltaVentilador) == 0){
      this.velocidad_anterior = this.velocidad_ventilador;
      this.velocidad_ventilador = this.calcularVelocidadVentilador();
    }
    
    this.run(contador+1);
    return;
  }

  // Simulación de la medición de la temperatura
  realizarMedicion() {
    // Temperatura real del micro (sin error)
    const temperatura_real = this.api_temp.get();
    this.temperatura_micro = temperatura_real;
    
    // Guardamos la medicion **al principio** 
    let ERROR_PRECISION_SENSOR = (Math.random() - 0.5)*0.5; //Agregamos un error de +- 0.25 a la medicion
    const error_anterior = this.mediciones[0] ? this.mediciones[0].error : 0;

    this.mediciones.unshift(
      {
        temp : temperatura_real + ERROR_PRECISION_SENSOR, 
        time : this.timer/1000 , // tiempo en segundos
        error: temperatura_real - this.temperatura_deseada + ERROR_PRECISION_SENSOR,
        delta_error : error_anterior - (temperatura_real - this.temperatura_deseada + ERROR_PRECISION_SENSOR)
      }
    );

    // Actualizamos la sumatoria de errores y temperaturas
    
    // Si el conteo de mediciones es mayor al máximo, sacamos la ultima medición
    // y actualizamos las sumatorias
    if(this.mediciones.length > MAX_MEDICIONES_GUARDADAS){
      let ultimaMedicion = this.mediciones.pop();
      if (ultimaMedicion){
        this.sumatoria_errores      -= ultimaMedicion.error;
        this.sumatoria_temperaturas -= ultimaMedicion.temp;
      }
    }
    this.sumatoria_errores      += this.mediciones[0].error;
    this.sumatoria_temperaturas += this.mediciones[0].temp;
  }

  // Simulación del efecto de enfriamiento del ventilador sobre el micro
  async simularEfectoVentilador() {
    await this.api_temp.aumentar(-this.calcularEfectoEnfriamiento());
  }

  // Simulación del calentamiento del micro (sin ventilador)
  async simularCalentamientoMicro( temp_max : number , rate : number) {
    if(this.temperatura_micro<temp_max)
      await this.api_temp.aumentar(rate);
  }

  // Función para simular el calentamiento del micro por eventos externos
  evento_micro(evento: string) {
    switch(evento){
      case '70':
        this.api_temp.set(70);
        break;
      case 'app':
        this.procesos_activos++;
        break;
      case 'chrome':
        this.procesos_activos+=2;
        break;
    }
  }

  
  // Función para simular el efecto de enfriamiento de los ventiladores
  /** 
    *  Los ventiladores discipan el calor del microprocesador
    *  lo que permite que la temperatura lo llevada a la temperatura ambiente **/
  calcularEfectoEnfriamiento( ): number {
    // Constantes para la simulación (ajustar según sea necesario)
    const maxEfectoEnfriamiento     = 0.2;  // Máximo índice de enfriamiento del ventilador (en °C por unidad de tiempo)
    const maxDiferenciaTemperatura  = 5;    // A partir de esta diferencia de temperatura, el enfriamiento es mayor

    // Cálculo de la diferencia de temperatura entre el microprocesador y el ambiente
    const diferenciaTemperatura = this.temperatura_micro - this.temperatura_deseada;

    // Ecuación para modelar el efecto de enfriamiento considerando la diferencia de temperatura
    const efectoEnfriamiento = (
      maxEfectoEnfriamiento *
      (1 - Math.exp(-this.velocidad_ventilador / MAX_VELOCIDAD_VENTILADOR)) *
      Math.pow(diferenciaTemperatura / maxDiferenciaTemperatura, 2) * // Aumenta el enfriamiento si la diferencia es mayor 
      Math.sign(diferenciaTemperatura) // Asegura que no haya enfriamiento si la diferencia es negativa
    );

    return efectoEnfriamiento;
  }

  // Función para calcular la velocidad del ventilador basada en la salida del PID
  calcularVelocidadVentilador(): number {
    if(this.temperatura_deseada > this.temperatura_micro) {
      return 0;
    }
    const maxPID = 100;                       // Valor máximo de salida del controlador PID
    const resultadoPID = this.calcularPID();  // Calcula el PID

    // Mapea la salida del PID al rango de velocidad del ventilador
    return (resultadoPID / maxPID) * MAX_VELOCIDAD_VENTILADOR;
  }

  // Función para calcular el PID
  calcularPID(): number {
    // Constantes para el control PID (ajustar estos valores según tu sistema)
    const Kp = 0.8;
    const Ki = 0.4;
    const Kd = 0.2;

    // Calcular la mediana de los errores más recientes
    const promedio_errores = this.sumatoria_errores / (this.deltaVentilador/this.deltaTimer);

    // Calcular el término Proporcional (P) como la media de los errores más recientes
    const p = Kp * promedio_errores;

    // Calcular el término Integral (I) como la suma de todos los errores
    const i = Ki * this.sumatoria_errores;

    // Calcular el término Derivativo (D) como la diferencia entre medianas de intervalos Δt₂
    const d = Kd * (promedio_errores - this.promedio_errores_anterior);

    // Actualizar el valor de la media de los errores más recientes
    this.promedio_errores_anterior = promedio_errores;

    console.log("P: " + p + " I: " + i + " D: " + d);
    console.log("PID: " + (p + i + d));

    return p + i + d;
  }

  // Función para aumentar el reloj de la simulación y esperar un tiempo determinado
  async aumentarClock() {
    if(this.timer > 100000){
      this.timer = 0;
    }
    this.timer+=this.deltaTimer;
    await sleep(this.deltaTimer); // Si se elimina esta línea, la simulación se ejecuta lo más rápido posible
  }
}
