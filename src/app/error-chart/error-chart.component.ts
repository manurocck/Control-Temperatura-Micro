import { Component, Input, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
// import { BaseChartDirective } from 'ng2-charts';


@Component({
  selector: 'app-error-chart',
  templateUrl: './error-chart.component.html',
  styleUrls: ['./error-chart.component.css']
})
export class ErrorChartComponent {

  toggle_xray = false;

  constructor() {  }

  // @Input() 
  // chart_data:
  // {
  //   temporizador: number[], 
  //   t_sensada: number[], 
  //   t_real: number[]
  // } = 
  // { temporizador : [] , t_sensada : [] , t_real : [] }; // default value

  @Input()
  public lineChartData: ChartConfiguration['data'] = 
  {
    datasets:
    [
      { 
        // data: this.chart_data.t_sensada, 
        data: [], 
        label: 'Temperatura medida'
      },
      { 
        // data: this.chart_data.t_real, 
        data: [], 
        label: 'Temperatura real' 
      }
    ],
    // labels: [this.chart_data.temporizador.map( (x) => x.toString()+"s")]
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    // Disable animation when adding/removing datasets
    animation: {
      duration: 0,
    },
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      y: {
        // scale from 10 to 80
        min: 20,
        max: 75,
        position: 'right',
        ticks: {
          // add °C to the y axis
          callback: function(value: any, index: any, values: any) {
            return value + '°C';
          }
        },
      },
    },
    plugins: {
      legend: { 
        display: false
      },
    },
  };

  public lineChartType: ChartType = 'line';

  // @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  
  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }
}
