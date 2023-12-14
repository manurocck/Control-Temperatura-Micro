import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiTemperaturaService {
  temperatura_micro : number = 20;
  
  async aumentar(salto: number) {
    // console.log("Aumentando temperatura en "+salto);
    this.temperatura_micro += salto;
  }
  
  get(){
    return this.temperatura_micro;
  }
  set(value: number) {
    this.temperatura_micro = value;
  }

  constructor() { }
}
