import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';         // Allow routing to various pages
import { AppComponent } from './app.component';
import { TagListComponent} from './tags/tag-list.component';
import { TagGageComponent } from './tags/tag-gage.component';           // Import the tags componet we created
import { TagTsdsComponent } from './tags/tag-tsds/tag-tsds.component';  // Create Tab just for the booth.
import { WelcomeComponent } from './home/welcome.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketService } from './shared/socket.service';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//import { HighchartsChartModule } from 'highcharts-angular';   // install - dependency issues

const config: SocketIoConfig = { url: 'http://localhost:5002' };

@NgModule({
  declarations: [
    AppComponent,
    TagListComponent,                                    // List tags and their values
    TagGageComponent,                                    // Refer to the tag-gage.componet (Gages)
    WelcomeComponent,
    TagTsdsComponent                                     // Seperate componet for booth variables
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    //HighchartsChartModule,
    ToastrModule.forRoot(),                                // ToastrModule added - Alerting
    SocketIoModule.forRoot(config),
    RouterModule.forRoot([                                 // This allows routing of pages and
    { path: 'welcome', component: WelcomeComponent },
    { path: 'tags', component: TagListComponent },
    { path: 'gage', component: TagGageComponent },
    { path: 'tsds', component: TagTsdsComponent },
    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    { path: '**', redirectTo: 'welcome', pathMatch: 'full' }
  ]),
  FormsModule
  ],

  providers: [SocketService],
  bootstrap: [AppComponent]
})

export class AppModule { }
