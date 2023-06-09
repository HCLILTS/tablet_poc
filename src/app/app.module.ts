import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injector } from '@angular/core';
 import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SignalrCustomModule } from './common/signalr';
import { NouisliderModule } from 'ng2-nouislider';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AnimationComponent } from './modules/Global/animation/animation.component';
import { InactivityTimerComponent } from './modules/Global/inactivity-timer/inactivity-timer.component';
import { LoaderComponent } from './modules/Global/loader/loader.component';
import { ControlsComponent } from './modules/Global/controls/controls.component';
import { QuesControllerComponent } from './modules/Global/ques-controller/ques-controller.component';
import { NTitleComponent } from './modules/Global/ntitle/ntitle.component';
import { ApplicationmodelService } from './common/services/applicationmodel.service';
import { SharedserviceService } from './common/services/sharedservice.service';
import { CommonloaderService } from './common/services/commonloader.service';
import { DataloaderService } from './common/services/dataloader.service';
import { HttphandlerService } from './common/services/httphandler.service';
import { EvaModule } from './modules/EVA/eva.module'
import { ContainerComponent } from './modules/Global/container/container.component';
import { createCustomElement } from '@angular/elements';
import { ParentcommunicationService } from './common/services/parentcommunication.service';
import { ElementaryModule } from './modules/Elementary/elementary.module';
import { VideoComponent } from './modules/Global/video/video.component';
import { BarahkhadiModule } from './modules/Barahkhadi/barahkhadi.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';


@NgModule({
  declarations: [
    AppComponent,
    AnimationComponent,
    InactivityTimerComponent,
    LoaderComponent,
    ControlsComponent,
    QuesControllerComponent,
    NTitleComponent,
    VideoComponent,
    ContainerComponent
  ],
  imports: [
    BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		AppRoutingModule,
		FormsModule,
		SignalrCustomModule.forRoot(),
		NouisliderModule,
		NgxPaginationModule,
    EvaModule,
    ElementaryModule,
    BarahkhadiModule,
    NgxSliderModule
  ],
  exports: [  ],
  providers: [DataloaderService, ApplicationmodelService, CommonloaderService, HttphandlerService, SharedserviceService, ParentcommunicationService],
  // entryComponents: [AppComponent]
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(appModel: ApplicationmodelService, private injector: Injector) { }
  // ngDoBootstrap() {
  //   const el = createCustomElement(AppComponent, { injector: this.injector });
  //   if (!customElements.get('angular-9-comp')) {
  //     customElements.define('angular-9-comp', el);
  //   }
  // }
}
