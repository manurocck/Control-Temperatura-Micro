import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MicroprocesadorComponent } from './microprocesador/microprocesador.component';
import { SensorComponent } from './sensor/sensor.component';
import { VentiladorComponent } from './ventilador/ventilador.component';
import { XrayComponent } from './xray/xray.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';

@NgModule({
  declarations: [
    AppComponent,
    MicroprocesadorComponent,
    SensorComponent,
    VentiladorComponent,
    XrayComponent,
    ConfiguracionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
