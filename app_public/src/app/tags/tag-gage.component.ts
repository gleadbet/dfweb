import {  AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';  // Make sure we have life cycle 
import { IDTag, ITag, IUPDTag } from './tag';                           // Interface used for tage
import { ApiService } from '../shared/api.service';
import { SocketService } from '../shared/socket.service';
import { Subscription, asyncScheduler } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

//import { Socket } from 'ngx-socket-io';
//import { HighchartsStockChartModule } from 'highcharts-ng';

// Highchart test code
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';

// Define where the data goes and organized.
export interface Tile {
  name: string;
  friendlyName: string;
  value: any;
  heartbeat: any;
}


// Define as a componet, which will be identified in the app.componet
@Component({
  // selector: 'tg-tage-gage',    -- this will be part of routing ... not embeded
  templateUrl: './tag-gage.component.html',
  styleUrls: ['./tag-gage.component.css']
  //imports: [HighchartsChartModule]
})


// Develop class that gets info from tag values for Endpoint
export class TagGageComponent implements OnInit, OnDestroy {
  
  pageTitle = 'Real Time Tag Gages';
  errorMessage = '';
  tag: ITag | undefined;
  hbSub: Subscription | undefined;    // subscribe to heartbeats, define variable
  heartbeatTags = [];

  // Initalize the tag info, otherwise it will try to read something before the websocket update
  tiles: Tile[] = [
    { name: "",friendlyName: "", value: 0, heartbeat: 0  },
    { name: "",friendlyName: "", value: 0, heartbeat: 0  },
    { name: "",friendlyName: "", value: 0, heartbeat: 0  },
    { name: "",friendlyName: "", value: 0, heartbeat: 0  },
    { name: "",friendlyName: "", value: 0, heartbeat: 0  }
  ];

  showChart = [];
  trendTag = "";
  socketTags = [];
  chardata: any[] = [];         // Line Graph temps

 // use interface to define tag from the post
 // Initalize before socket update          
 tagvals: IUPDTag[] = [
   { Tagname: "(tagname)",LatestRecord:{time: "", value: 0, qod: 0 } },
   { Tagname: "(tagname)",LatestRecord:{time: "", value: 0, qod: 0 } },
   { Tagname: "(tagname)",LatestRecord:{time: "", value: 0, qod: 0 } },
   { Tagname: "(tagname)",LatestRecord:{time: "", value: 0, qod: 0 } }
  ]

  atagvals: IUPDTag[] = [
    { Tagname: "(tagname)",LatestRecord:{time: "", value: 0, qod: 0 } },
    { Tagname: "(tagname)",LatestRecord:{time: "", value: 0, qod: 0 } },
    { Tagname: "(tagname)",LatestRecord:{time: "", value: 0, qod: 0 } },
    { Tagname: "(tagname)",LatestRecord:{time: "", value: 0, qod: 0 } }
   ]


  // we we use sockets and the api to get data, we must create intectable
  constructor(private apiService: ApiService, private socket: SocketService, private toastr: ToastrService) { 

  }  // ******* End Contructor ******

  showToaster(){
    this.toastr.success("Hello, I'm the toastr message.")
  }

  showSuccess(){
    this.toastr.success("GOOD Heartbeat.")
  }

  showError(){
    this.toastr.error("HeartBeat Stopped.")
  }
  // Current tag data from pipeline ...
    //   {
    //     "Tagname": "CAM-TS-01:MultiCoat.Heartbeat",
    //     "LatestRecord": {
    //       "time": "2023-08-08T18:45:57.663Z",
    //       "value": -32483,
    //       "qod": 192
    //     }
    //   }
    // ]

  ngOnInit() {
    this.socket.initSocket();

    // Pull socket data from the service
    // hopefully the consturctor created the socket, let make sure 
    this.socket.getStatus();
    console.log("Initalize Gage componet " );

    // subscribe to heartbeat and start looking if data comes
    // this.hbSub = this.socket.OnHeartBeats()
    // .subscribe((res: never[]) => {
    //   console.log("heartBeats",JSON.stringify(res, null,2)); // Debug in console
    //   this.heartbeatTags = res;
    //   this.tagvals=res })                       // This line is magic .. data brought into interface
      this.updateSocket();                      // Look at all the tages
    }


public ngAfterViewInit(): void {
  this.createChartGauge();    // Create  guage from HighChart library - Accura Head Temp
  this.createChartGauge1();   // Create  guage from HighChart library - Heartbeat 
  this.createChartGauge2();   // Create  guage from HighChart library - MC Inlet Temp
  this.createChartGauge3();   // Create  guage from HighChart library - RaspberryPi.CISS.AmbientTemperature
  this.createLineChart();
}

  // Clean up subsription 
  ngOnDestroy(): void {
    console.log("Destroy Gage componet " );
    // Stop socket data when exiting
    this.socket.stopData();           // Stop Tag data
    this.socket.endStatus();          //  Used for heartbeats

    // must test if it's possibly not subscribed yet ...
    // if(this.hbSub)
    //   this.hbSub.unsubscribe();
  } // End destroy


// Result of push, and could have just assigned like below but was working on issues
//  and previous code pushed values
// Demo notes -- 
// justTags[0] = "CAM-TS-01:MultiCoat.J1_TT_01";             -- MC_Inlet Temperature
// justTags[1] = "CAM-TS-01:AccuraSpray4_headTemperature";   -- Accura Head Temp
// justTags[2] = "CAM-TS-01:MultiCoat.Heartbeat";
// justTags[3] = "CAM-TS-01:RaspberryPi.CISS.AmbientTemperature"  -- Added 11/30 

// send the request for the tags specified
    updateSocket() {
        // Stop socket data for now
        this.socket.stopData();

        // Define tags we want get data on  -- TODO put in a form, allow selection
        var tagNames: string[] = ["CAM-TS-01:MultiCoat.Heartbeat","CAM-TS-01:MultiCoat.J1_TT_01",
          "CAM-TS-01:AccuraSpray4_headTemperature","CAM-TS-01:RaspberryPi.CISS.AmbientTemperature"];

        // Below code was in previous webserver, probably not neccessary unless used in conjuction with Chrome
        var justTags: any[] = [];
        tagNames.forEach(j => { justTags.push(j);
        })

        // Call the back end and pass the tag values we just created (Note: TODO: - Put in a drop down selection)
        this.socket.getData(justTags);

        // Subscribe to the socket, the data comes back in the "res"
        this.socket.OnData()
        .subscribe(res => {
          this.tiles=res;
          var tagloopInx = 0;  
          var index = 0;

          // Assign socket result tag array to the interface
          res.forEach((tag: { Tagname: string ; LatestRecord: { value: any; }; }) => {
            
            // Debug in console of Chrome
            // res has an array of Tags we get from the socket
            console.log("tag name",JSON.stringify(res, null,2));        

            // The findIndex() method in TypeScript is used to find the first index of an array element 
            //  that matches a specified condition. The syntax is:
            //  const index = array.findIndex(element => condition);
            //  index returns the index of the found string or -1 if not found
            // In our case we have the result (res) of tags assigend to this. We want to find if these tags we recivied
            //   are in the list to display. If they are, let reformat them to the defined Interface
            index = this.tiles.findIndex(tile => tag.Tagname.includes(justTags[tagloopInx]));
			
            //  setup Title array for the tags and values to display
            if(index != -1){				
                console.log(`(*** found *** ) Titles ${tag.Tagname} Index:${tagloopInx}`);						// If found show in chrome            
                this.tiles[tagloopInx].value = tag.LatestRecord.value;
                this.tiles[tagloopInx].name = tag.Tagname;
                ++tagloopInx%justTags.length;
            }

          })
          console.log(`(updateSocket) Titles ${JSON.stringify(this.tiles, null,2)}`);
        })

        this.tiles = this.tiles.slice();
      }


      // HighChart Guage - Accura Head Temp  
      private createChartGauge(): void {

        const chart = Highcharts.chart('container', {
          chart: {
            type: 'gauge',
          },
          title: {
            text: 'AccuraSpray Head Temp',
          },
          credits: {
            enabled: false,
          },
          pane: {
            center: ['50%', '75%'],
            size: '100%',
            startAngle: -90,
            endAngle: 90,
            background: {
              backgroundColor: '#EEE7',
              innerRadius: '60%',
              outerRadius: '110%',
              shape: 'arc'
            },
          },
          yAxis: {
            min: 0,
            max: 60,
            tickPixelInterval: 75,
            tickPosition: 'inside',
            tickColor:  '#55BF3B',
            tickLength: 10,
            tickWidth: 4,
            minorTickInterval: null,
            labels: {
              distance: 20,
              style: {
                  fontSize: '12px'
              }
            },
            title: {
              text: 'Deg C'
            },
          },
          plotOptions: {
            solidgauge: {
              dataLabels: {
                y: -25,
                borderWidth: 0,
                useHTML: true,
              },
            },
          },
          tooltip: {
            enabled: false,
          },
          series: [{
            name: null,
            data: [0],
            dataLabels: {
              format: '<div style="text-align: center"><span style="font-size: 1.25rem">{y}</span></div>',
            },
          }],
        } as any);
      
        // this is done to set the polling rate.
        setInterval(() => {
          //chart.series[0].points[0].update(this.getRandomNumber(0, 100));
          // Allow for data to fill the array ...
          chart.series[0].points[0].update(this.tiles[2].value);
            // else { chart.series[0].points[0].update(0); }
          }, 1000);

        }   // End of Guage
      
 
      // HighChart Guage - Heartbeat  
      private createChartGauge1(): void {
        let curval=0;
        let lastCount=0;

        const chart = Highcharts.chart('container1', {
          chart: {
            type: 'gauge',
            styledMode: false
          },
          title: {
            text: 'Muliti Coat HeartBeat',
          },
          credits: {
            enabled: false, 
          },
          pane: {
            startAngle: -180,
            endAngle: 180,
            background: [{
                outerRadius: '110%'
            }, {
                outerRadius: '90%'
            }]
          },
    // the value axis
    yAxis: {
      min: 0,
      max: 33000,
      minorTickInterval: 'auto',
      minorTickWidth: 1,
      minorTickLength: 10,
      minorTickPosition: 'inside',
      minorTickColor: '#666',
      tickPixelInterval: 50,
      tickWidth: 2,
      tickPosition: 'inside',
      tickLength: 10,
      tickColor: '#666',
      labels: {
          step: 2,
          rotation: 'auto'
      },
      title: {
          text: 'counts'
      },
      plotBands: [{
          from: 0,
          to: 40,
          className: 'good'
      }, {
          from: 40,
          to: 60,
          className: 'bad'
      }, {
          from: 60,
          to: 100,
          className: 'ugly'
      }]
    },
    tooltip: {
            enabled: false,
          },
    series: [{
            name: "Temp",
            data: [80],
            dataLabels: {
              format: '<div style="text-align: center"><span style="font-size: 1.50rem">{y}</span></div>',
            },
          }],
        } as any);
      
        // this is done to set the polling rate.
        setInterval(() => {
          //chart.series[0].points[0].update(this.getRandomNumber(0, 200)); // simulation for data
          // Allow for data to fill the array ...
            if( typeof  this.tiles[0].value !== "undefined") {
              curval=Math.abs(this.tiles[0].value);

              if(lastCount!=0 && curval==lastCount){
                console.log(`ERROR - DATA NOT Upadating ${lastCount} : ${curval}`)
                this.showError();
                this.socket.sendAlert("Missing Heartbeat");

              }
              else{
                chart.series[0].points[0].update(curval);  // try to show pos display
                lastCount=curval;
                console.log(`HEART BEAT DATA  Upadating: ${lastCount}`);
                this.showSuccess();
              }
            }
            else { chart.series[0].points[0].update(0); }
        }, 4000);

      }   // End of Guage1  ******************     


      // Function used for tesintg, sends randome values to the chard for testing.
      private getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min)
      }
	  
 // HighChart Guage -'MC Inlet Temp 
 private createChartGauge2(): void {
  const chart = Highcharts.chart('container2', {
    chart: {
      type: 'solidgauge',
    },
    title: {
      text: 'MC Inlet Temp',
    },
    credits: {
      enabled: false,
    },

    pane: {
      center: ['50%', '50%'],
      size: '75%',
      startAngle: -140,
      endAngle: 140,
      background: {
          backgroundColor: '#EEE',
          innerRadius: '65%',
          outerRadius: '100%',
          shape: 'arc',
          borderColor: 'transparent',
      }
  },
  // the value axis
  yAxis: {
    min: 0,
    max: 60,
    tickPixelInterval: 75,
    tickPosition: 'inside',
    tickColor:  '#55BF3B',
    tickLength: 20,
    tickWidth: 4,
    minorTickInterval: null,
    labels: {
        distance: 10,
        style: {
            fontSize: '12px'
        }
    },
    title: {
      text: 'Deg C'
    },
    stops: [
      [0.1, '#55BF3B'], // green
      [0.5, '#DDDF0D'], // yellow
      [0.9, '#DF5353']  // red
    ],
    lineWidth: 1,
    plotOptions: {
      solidgauge: {
          innerRadius: '5%',
          dataLabels: {
              style: {'fontSize': '36px', 'font-family': 'Muli, Helvetica Neue, Arial, sans-serif', 'fontWeight': 'light'},
              y: -45,
              borderWidth: 0,
          }
      }
  },                                                      //        color: '#55BF3B', // green
                                                           //        color: '#DDDF0D', // yellow
                                                           //        color: '#DF5353', // red
    plotBands: [{
        from: 0,
        to: 5,
        color: '#DDDF0D', // yellow        
        thickness: 5
    }, {
        from: 5,
        to: 30,
        color: '#55BF3B', // green
        thickness: 5
    }, {
        from: 30,
        to: 80,
        color: '#DF5353', // red
        thickness: 5
    }]
},

    series: [{
      type: "solidgauge",
      rounded: false,
      name: "Deg C",
      data: [{
        radius: '115%',
        innerRadius: '100%',
        y: 90
      }],
      dataLabels: {
        format: '<div style="text-align: center"><span style="font-size: 1.25rem">{y}</span></div>',
      },
    }],
    
  } as any);

  // this is done to set the polling rate.
  setInterval(() => {
    //chart.series[0].points[0].update(this.getRandomNumber(0, 100));
    // Allow for data to fill the array ...
    chart.series[0].points[0].update(this.tiles[1].value);
      // else { chart.series[0].points[0].update(0); }
    }, 1000);

  }   // End of Guage
 

// HighChart Guage -"CAM-TS-01:RaspberryPi.CISS.AmbientTemperature" 
private createChartGauge3(): void {

  let updCnt=0;
  const chart3 = Highcharts.chart('container4', {
    chart: {
      type: 'solidgauge',
    },
    title: {
      text: 'AmbientTemperature Temp',
    },
    credits: {
      enabled: false,
    },

    pane: {
      center: ['50%', '50%'],
      size: '75%',
      startAngle: -140,
      endAngle: 140,
      background: {
          backgroundColor: '#EEE',
          innerRadius: '65%',
          outerRadius: '100%',
          shape: 'arc',
          borderColor: 'transparent',
      }
     },

 // the value axis
  yAxis: {
    min: 0,
    max: 60,
    tickPixelInterval: 75,
    tickPosition: 'inside',
    tickColor:  '#55BF3B',
    tickLength: 20,
    tickWidth: 2,
    minorTickInterval: null,
    labels: {
        distance: 10,
        style: {
            fontSize: '12px'
        }
    },
    title: {
      text: 'Deg C'
    },
    stops: [
      [0.1, '#55BF3B'], // green
      [0.5, '#DDDF0D'], // yellow
      [0.9, '#DF5353']  // red
    ],
    lineWidth: 2,
    plotOptions: {
      solidgauge: {
          innerRadius: '15%',
          dataLabels: {
              style: {'fontSize': '36px', 'font-family': 'Muli, Helvetica Neue, Arial, sans-serif', 'fontWeight': 'light'},
              y: -45,
              borderWidth: 0,
          }
      }
    },                                    

    plotBands: [{
        from: 0,
        to: 5,
        color: '#DDDF0D', // yellow        
        thickness: 5
    }, {
        from: 5,
        to: 30,
        color: '#55BF3B', // green
        thickness: 5
    }, {
        from: 30,
        to: 80,
        color: '#DF5353', // red
        thickness: 5
       }]
   },

    series: [{
      type: "solidgauge",
      rounded: false,
      name: "Deg C",
      data: [{
        radius: '75%',
        innerRadius: '90%',
        y: 90
      }],
      dataLabels: {
        format: '<div style="text-align: center"><span style="font-size: 1.25rem">{y}</span></div>',
      },
    }],

  } as any);

  // this is done to set the polling rate.
  setInterval(() => {

    // make it easy to write series data 
    var series3:any = chart3.series[0];

    // update will not work unless you convert this 
    let curval=parseFloat(this.tiles[3].value);

    // updCnt give you a few loops to get a value .... probably better ways to do this
    if(curval != undefined && updCnt>3) {
      //series3.points[0].update(this.getRandomNumber(0, 100));
      series3.points[0].update(curval);
      //console.log(`Updating Ambient Value:${curval}`);
    }
    updCnt++;

    }, 2000);

  }   // End of Guage
  
// HighChart - Line Graph
// justTags[0] = "CAM-TS-01:MultiCoat.J1_TT_01";    -- MC_Inlet Temperature
private createLineChart(): void {
  var series: any =[];

  const chart = Highcharts.chart('container3', {

    chart: {
      type: 'spline',
      tickPixelInterval : 150,
      zoomType: 'xy',
      scrollablePlotArea: {
        minWidth: 600,
        scrollPositionX: 1
      }
    },
    title: {
      text: 'MC Inlet Temp',
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      type: 'datetime',
      labels: {
        format: '{value:%b-%e %H:%M:%S}',
        overflow: 'justify'
      },
    },
    yAxis : [ {
      title : {
          text : 'Deg C'
      },
      yAxis: {
        type: 'logarithmic',
        min: 10, // Will for min and max to adjust when you zoom                      
        max: null, //
    },
      plotLines : [ {
          value : 0,
          width : 1,
          color : '#808080'
          } ]
      }, ],
      dataLabels: {
        enabled: true
      },    
    tooltip: {
      labels: {
        format: '{value:%H:%M%S}',
      }
    },
    rangeSelector: {
      selected: 0,
      buttonTheme: {
        width: 50
      },
      buttons: [{
        type: 'minute',
        count: 5,
        text: '5 min',
        title: 'View 5 min'
      }, {
        type: 'minute',
        count: 10,
        text: '10 min',
        title: 'View 10 min'
      }, {
        type: 'minute',
        count: 15,
        text: '15 min',
        title: 'View 15 min'
      }, {
        type: 'minute',
        count: 30,
        text: '30 min',
        title: 'View 30 min'
      }, {
        type: 'minute',
        count: 60,
        text: '60 min',
        title: 'View 60 min'
      }]
    },

    series: [{
      name: 'MC-Inlet Temp',
      dataGrouping: {
        enabled: false
      },
       pointStart: Date.now(),
      // pointInterval: 24 * 60 * 60 * 1000,
      data: [0],
      dataLabels: {
        format: '<div style="text-align: center"><span style="font-size: 1.25rem">{y}</span></div>',
      },
    }],
    
  } as any);

// Request from server seting all data
// Get current time in miliseconds so we can add milisecon interval
// initalize variables, setup data array, then slice the values from it
var data:any = [],time = (new Date()).getTime(),i=0;

// make it easy to write series data 
var series:any = chart.series[0];
// Use current data for start of legend.
series.pointStart=Date.now;
//Show tickes every 5 msec since that is what the interval rate
series.pointInterval=5000

setInterval(() => {
  // Read the value from the socket
  var value = this.tiles[1].value;
  // Make sure the value exists
  if(value!=undefined) {

    // we want to increment a data point .. but only so big .. like a days worth?
    i = (++i)%3600;

    // fill the data array with values to plot.
    time=time + (i * 5000)
    data.push([time, value]);

    const lastPoint = data.length-1;          // Index of the last point
    var x = data[lastPoint],
        y = value;

    series.addPoint([x, y]);

    // Simulate adding points on server -- turned out I did not need this, but may be useful for simulation
    // dataFromServer.push([x, value])
    // chart.series[0].setData(dataFromServer);
  }
}, 1500);

  // Request from server seting all data
  //const dataFromServer = data.slice();
  
  // setInterval(function() {
  //   chart.series[0].setData(dataFromServer);
  // }, 5000);

  }   // End of linechart  *********************


} // end of Tag Guage class  ****************


/*   
 ---  Below is the output result from the socket call to tagdata ( 3 tags specified )
tag-gage.component.ts:124 (updateSocket) Titles 
tag-gage.component.ts:78 heartBeats [
  {
    "Tagname": "CAM-TS-01:MultiCoat.Heartbeat",
    "LatestRecord": {
      "time": "2023-10-19T11:53:00.482Z",
      "value": 52,
      "qod": 192
    }
  }
]
3tag-gage.component.ts:117 tags [
  {
    "Tagname": "CAM-TS-01:MultiCoat.Heartbeat",
    "LatestRecord": {
      "time": "2023-10-19T11:53:00.482Z",
      "value": 52,
      "qod": 192
    }
  },
  {
    "Tagname": "CAM-TS-01:AccuraSpray4_headTemperature",
    "LatestRecord": {
      "time": "2023-08-08T18:46:05.029Z",
      "value": 41.686,
      "qod": 192
    }
  },
  {
    "Tagname": "CAM-TS-01:MultiCoat.J1_TT_01",
    "LatestRecord": {
      "time": "2023-08-08T18:45:57.663Z",
      "value": 23.7056,
      "qod": 192
    }
  }
]
*/