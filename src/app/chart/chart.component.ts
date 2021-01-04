import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import highchartsSankey from 'highcharts/modules/sankey';
import { lineOption, sankeyOption, parallelOptions } from './chartoptions'
highchartsSankey(Highcharts);
import * as moment from 'moment';




interface ChartType {
  value: string;
}


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  chartTypes: ChartType[] = [
    { value: 'Sankey Chart' },
    { value: 'Parallel coordinates Chart' },
    { value: 'Simple Line' }
  ];

  moment = moment()

  /**
   * Created at 2021-1-1 at 10AM - 150505050
   * Filter - 1 month ago - in millisc = filter(obj=> obj.createdAt >= this.selectedSince (in ms) )
   * 
   */

  sinceValues = [{
    name: '1 day ago',
    value: moment().subtract(1, 'day').valueOf()
  }, {
    name: '5 days ago',
    value: moment().subtract(5, 'days').valueOf()
  }, {
    name: '1 month ago',
    value: moment().subtract(1, 'month').valueOf()
  }];

  rowValues = [{
    name: '3',
    value: 3
  }, {
    name: '5',
    value: 5
  }, {
    name: '10',
    value: 10
  }];

  selectChartType(event: Event) {
    if (event['value'] != 'Sankey Chart' && this.isCurrentFileSankey()) {
      return alert('Please select a different formatted file other than sankey');
    }

    else if (event['value'] == 'Sankey Chart' && !this.isCurrentFileSankey()) {
      return alert('Please select a sankey formatted file');
    }
    this.selectedChartType = event['value'];
    this.renderChart();
  }

  highcharts = Highcharts;
  chartOptions = {};
  updateFlag: Boolean;
  toDisplay = true;
  selectedChartType = this.chartTypes[0].value;
  selectedSinceValue = this.sinceValues[0].name;
  selectedRowValue;
  fileContent;
  seriesData;


  renderChart() {
    this.toDisplay = false;
    switch (this.selectedChartType) {
      case 'Simple Line': {
        this.chartOptions = { ...lineOption };
        this.chartOptions['series'] = [];
        if (!this.fileContent) return;

        this.fileContent.forEach(o => {
          const keys = Object.keys(o);
          keys.forEach(k => {
            const obj = this.chartOptions['series'].find(r => r.name == k);
            if (obj) {
              obj['data'].push(parseInt(o[k]))
            } else {
              let t = {
                name: k,
                data: [parseInt(o[k])]
              }
              this.chartOptions['series'].push(t);
            }
          })
        });

        this.seriesData = this.chartOptions['series'];
        break;
      }
      case 'Parallel coordinates Chart': {
        this.chartOptions = { ...parallelOptions }
        this.chartOptions['series'] = [];
        if (!this.fileContent) return;

        this.chartOptions['xAxis']['categories'] = Object.keys(this.fileContent);
        this.fileContent.forEach(o => {
          const vals = Object.values(o).map(t => Number(t));
          this.chartOptions['series'].push(vals)
        });
        this.chartOptions['series'] = this.chartOptions['series'].map(function (set, i) {
          return {
            name: 'Data ' + i,
            data: set,
            shadow: false
          };
        })

        this.seriesData = this.chartOptions['series'];
        break;
      }
      case 'Sankey Chart': {
        this.chartOptions = { ...sankeyOption }
        this.chartOptions['series'][0]['data'] = [];
        if (!this.fileContent) return;

        this.fileContent.forEach(o => {
          let t = [o['from'], o['to'], parseInt(o['weight'])];
          this.chartOptions['series'][0]['data'].push(t);
        })
        console.log(this.chartOptions['series']);
        this.seriesData = this.chartOptions['series']['data'];
        break;
      }
    }
    setTimeout(() => {
      this.toDisplay = true;
    }, 0);
  }

  ngOnInit(): void {
    console.log(this.sinceValues[0]);
    this.renderChart()
  }

  async onFileUpload($event) {
    const file = $event.target.files[0];
    if (file.type == 'text/csv') {
      const fileContent = await this.readFileContent(file);
      this.fileContent = this.csvJSON(fileContent);
      if (!this.isCurrentFileSankey() && this.selectedChartType == 'Sankey Chart') return alert('Please upload sankey formatted file or change the type of chart first')
      if (this.isCurrentFileSankey() && this.selectedChartType != 'Sankey Chart') return alert('Please upload line/parallel formatted file or change the type of chart first')
      this.renderChart();
    }

    else if (file.type == 'application/json') {
      this.fileContent = await this.readFileContent(file);
      if (!this.fileContent) return;
      this.fileContent = JSON.parse(this.fileContent);
      if (!this.isCurrentFileSankey() && this.selectedChartType == 'Sankey Chart') return alert('Please upload sankey formatted file or change the type of chart first')
      if (this.isCurrentFileSankey() && this.selectedChartType != 'Sankey Chart') return alert('Please upload line/parallel formatted file or change the type of chart first')
      this.renderChart();
    }

    else alert('Wrong file format. Upload JSON/CSV');
  }

  csvJSON(csv) {
    let lines = csv.split("\n");
    let result = [];
    let headers = lines[0].split(",");
    headers = headers.map(h => h.substr(1, h.length - 2))

    for (let i = 1; i < lines.length; i++) {
      let obj = {};
      let currentline = lines[i].split(",");
      currentline = currentline.map(c => {
        let t = parseInt(c.substr(1, c.length - 2));
        if (isNaN(t)) {
          c = c.substr(1, c.length - 2)
        } else c = t;
        return c;
      });
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
    return result;
  }

  readFileContent(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!file) {
        resolve('');
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const text = reader.result.toString();
        resolve(text);

      };

      reader.readAsText(file);
    });
  }

  filterByRow() {
    this.toDisplay = false;

    if (this.selectedChartType == 'Parallel coordinates Chart') {
      this.chartOptions['series'] = this.seriesData.slice(0, this.selectedRowValue).map(function (set, i) {
        return {
          name: 'Data ' + i,
          data: set,
          shadow: false
        };
      })

    }
    else if (this.selectedChartType == 'Sankey Chart') {
      this.chartOptions['series'] = this.chartOptions['series'][0]['data'].slice(0, this.selectedRowValue);
    }
    else {
      this.chartOptions['series'] = this.seriesData.slice(0, this.selectedRowValue);
    }

    setTimeout(() => {
      this.toDisplay = true;
    }, 0);
  }

  filterByTime() {
    this.toDisplay = false;

    if (this.selectedChartType == 'Parallel coordinates Chart') {
      this.chartOptions['series'] = this.seriesData.filter(o => o.createdAt >= this.selectedRowValue).filter(function (set, i) {
        return {
          name: 'Data ' + i,
          data: set,
          shadow: false
        };
      })

    }
    else {
      this.chartOptions['series'] = this.seriesData.filter(o => o.createdAt >= this.selectedSinceValue);
    }

    setTimeout(() => {
      this.toDisplay = true;
    }, 0);
  }

  isCurrentFileSankey() {
    const keys = Object.keys(this.fileContent[0]);
    return (keys.includes('from') || keys.includes('to') || keys.includes('weight'));
  }

}



