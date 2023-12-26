import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import { SocketService } from '../../shared/socket.service';
import { ApiService } from '../../shared/api.service';
import { ToastrService } from 'ngx-toastr';
import { IDTag, ITag, IUPDTag } from '../tag';          // Tag interfaces                 // Interface used for tage

// Highchart test code
import * as Highcharts from 'highcharts';


// Define where the data goes and organized.
export interface Tile {
  name: string;
  friendlyName: string;
  value: any;
  heartbeat: any;
}

@Component({
  selector: 'app-tag-tsds',
  templateUrl: './tag-tsds.component.html',
  styleUrl: './tag-tsds.component.css'
})

export class TagTsdsComponent implements OnInit, OnDestroy {

  pageTitle = 'Real Time Booth variables';

  // Initalize the tag info, otherwise it will try to read something before the websocket update
  tiles: Tile[] = [
    { name: "",friendlyName: "", value: 0, heartbeat: 0  },
    { name: "",friendlyName: "", value: 0, heartbeat: 0  },
    { name: "",friendlyName: "", value: 0, heartbeat: 0  },
    { name: "",friendlyName: "", value: 0, heartbeat: 0  },
    { name: "",friendlyName: "", value: 0, heartbeat: 0  }
  ];


 // use interface to define tag from the post
 // Initalize before socket update          
 tagvals: IUPDTag[] = [
  { Tagname: "(tagname)",LatestRecord:{time: "", value: 0, qod: 0 } },
  { Tagname: "(tagname)",LatestRecord:{time: "", value: 0, qod: 0 } },
  { Tagname: "(tagname)",LatestRecord:{time: "", value: 0, qod: 0 } },
  { Tagname: "(tagname)",LatestRecord:{time: "", value: 0, qod: 0 } }
 ]

  // we we use sockets and the api to get data, we must create intectable
  constructor(private apiService: ApiService, private socket: SocketService, private toastr: ToastrService) { 
  }  
  // ******* End Contructor ******

  ngOnInit() {
    this.socket.initSocket();

    // Pull socket data from the service
    // hopefully the consturctor created the socket, let make sure 
    this.socket.getStatus();
    console.log("Initalize TSDS componets " );
  }

// Tags monitored at the booth 
// CAM-TS-01:MultiCoat.P1_EUN_01	H1 Gun Voltage (SP)
// CAM-TS-01:MultiCoat.J1_FT_01	  Water Flow
// Calculated                     Net Power
// 
// CAM-TS-01:AccuraSpray4_correlation	AS4 Correlation
// CAM-TS-01:AccuraSpray4_correlationShift	AS4 Correlation Shift
// CAM-TS-01:AccuraSpray4_headTemperature	AS4 Head Temperature
// CAM-TS-01:AccuraSpray4_intensity	AS4 Intensity
// CAM-TS-01:AccuraSpray4_maskWidth	AS4 Mask Width
// CAM-TS-01:AccuraSpray4_partTemperature	AS4 Part Temperature
// CAM-TS-01:AccuraSpray4_plumeDensity	AS4 Plume Density
// CAM-TS-01:AccuraSpray4_plumeDeviation	AS4 Plume Deviation
// CAM-TS-01:AccuraSpray4_plumeWidth	AS4 Plume Width

// Send a message to get tag data
// Values to look at for the same recipe that could vary. 
// Gun voltage, water output, net power, and the accuraspray values. .  
// These are variables that, for the exact same recipe, might drift over time. 
// Possibly as either analog gage, or digital read outs

// send the request for the tags specified
updateSocket() {

  // Stop socket data for now
  this.socket.stopData();

        // Define tags we want get data on  -- TODO put in a form, allow selection
        var tagNames: string[] = ["CAM-TS-01:MultiCoat.P1_EUN_01",
        "CAM-TS-01:MultiCoat.J1_FT_01",
        "CAM-TS-01:AccuraSpray4_correlation",
        "CAM-TS-01:AccuraSpray4_correlationShift",
        "CAM-TS-01:AccuraSpray4_headTemperature",
        "CAM-TS-01:AccuraSpray4_intensity",
        "CAM-TS-01:AccuraSpray4_maskWidth",
        "CAM-TS-01:AccuraSpray4_partTemperature"
      ];

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



}   // ********************  end UpdateSocket()  *******************


  // Clean up subsription 
  ngOnDestroy(): void {
      console.log("Destroy TSDS componet " );

      // Stop socket data when exiting
      this.socket.stopData();           // Stop Tag data
      this.socket.endStatus();          //  Used for heartbeats
  
    } // End destroy









}
