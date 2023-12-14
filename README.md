<p align="center">
<img src="https://www.frba.utn.edu.ar/wp-content/uploads/2016/08/logo-utn.ba-horizontal-e1471367724904.jpg" width=50% height=50%>
</p>

# 🔥 Simulación de un Sistema de Control de T° de un Microprocesador
<p align="center">
<img src="https://github.com/manurocck/Control-Temperatura-Micro/assets/22857096/43465302-76af-4bb6-822a-62aca399f0c6" width=50% height=50%>
</p>

## Introducción

- Este proyecto simula un sistema de control de temperatura que consta de un sensor de temperatura, un microprocesador y un ventilador. 
- El sistema opera midiendo la temperatura del entorno a través del sensor, transmitiendo estos datos al microprocesador. El microprocesador calcula el error comparando la temperatura deseada con la temperatura medida. 
- Cuando el error supera un umbral predefinido, se desencadena un control correctivo sobre la temperatura activando el ventilador regulando su velocidad según la velocidad - anterior y el error actual.

## Configuración y Uso 💻 

Tienen que descargarse `nodejs` y `npm` para poder visualizar el proyecto.
Una vez que lo tienen instalado, ejecutar `npm install` para instalar dependencias
Por último ejecutar `npm run start` para correr el servidor localmente y navegá a la URL `http://localhost:4200/`.
La aplicación va a actualizarse automáticamente ante cualquier cambio.
