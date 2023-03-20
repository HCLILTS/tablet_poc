import { PlayerConstants } from '../playerconstants';
import { InitDataReader } from '../initdatareader';
import { InitializationAPI, Info } from '../initializationapi';
import { DataHandler } from '../interfaces/dataHandler';
import { Injectable, EventEmitter } from '@angular/core';
import { SignalR, BroadcastEventListener } from '@dharapvj/ngx-signalr';
import { PostmessagecommunicationService } from './postmessagecommunication.service';
import { BehaviorSubject } from 'rxjs';

declare var $: any;

@Injectable()
export class ExternalcommunicationService implements DataHandler {
  private signalInstance: any;
  private initValues: InitializationAPI;
  private listener;
  private success;
  private failure;
  private initData;
  private outPort1;
  private connection: any;
  iWindow: Window;
  hideNavigationBar = new BehaviorSubject<any>(false);

  constructor(signalInstance: SignalR, private PostmessagecommunicationService: PostmessagecommunicationService) {
    console.log('ExternalcommunicationService: constructor');

    this.signalInstance = signalInstance;
    console.log("this.signalInstance is " + this.signalInstance);
    //$$this.hideNavigationBar.next(true);
  }
  setInitData(initData) {
    this.initData = initData;
  }
  connect() {
    console.log('connect function');
    if (this.initData && !this.initData.environment.lms.contentInParam && this.initData.environment.platform != 'electron' && this.initData.environment.platform != 'android') {
      this.signalInstance.connect().then((c) => {
        console.log('ExternalcommunicationService: connect - c=', c);
        this.connection = c;
        this.connected();
        this.call('playerReady', null);
      });
    } else if (this.initData.environment.platform === 'electron') {
      console.log('jyoti ExternalcommunicationService: electron connect - c=',);
      // this.connection = c;
      this.connectedDL();
      //  let msg =  { 
      //   "method" : 'playerReady', 
      //   "data" : "some data"
      // } 
      // window.postMessage( msg , 'http://localhost:5000');      
    } else if (this.initData.environment.platform === 'android') {
      console.log(' ExternalcommunicationService: android connect - c=',);
      // this.connection = c;
      this.connectedDL();

    }
  }


  call(name: string, value: any[]) {
    console.log('ExternalcommunicationService: call - name=', name, 'value=', value);
    if (!value || value.length <= 0) {
      // invoke a server side method
      this.connection.invoke(name).then((data: any[]) => {
        console.log('ExternalcommunicationService: call - data=', data);
      });

    } else {
      // invoke a server side method, with parameters
      this.connection.invoke(name, ...value).then((data: any[]) => {
        console.log('ExternalcommunicationService: call - data=', data);
      });
    }
  }

  //disconnected() {
  //  setTimeout(function () {
  //    this.connection.hub.start();
  //  }, 5000); // Restart connection after 5 seconds.
  //}

  bindEvent(element, eventName, eventHandler) {
    if (element.addEventListener) {
      element.addEventListener(eventName, eventHandler, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + eventName, eventHandler);
    }
  }

  connectedDL() {
    console.log('connectedDL function');
    console.log('jyoti : external communication connected DL method before postmsg');
    let that = this;
    this.bindEvent(window, 'message', function (e) {
      //let data = JSON.stringify(e.data, null, 2);
      let data = JSON.parse(e.data);
      that.outPort1 = e.ports[0];
      //this.postmessagSub.next(e.ports[0]);
      that.outPort1.postMessage(data.method);
      switch (data.method) {

        case 'open':
          console.log("getting open method & the Json is:", data.data);
          that.outPort1.postMessage('Open Received In player');
          that.initValues = new InitDataReader().read(data.data);
          that.dataLoadedSuccess();
          //$$this.hideNavigationBar.next(true);
          console.log('DataloaderService: loadData', that.initValues);   
          return 'open method';

        case 'play':
          console.log('play event recieved');
          that.outPort1.postMessage('Play Received In player');
          let constantValue = PlayerConstants.CMS_PLAYER_PLAY;
          const infoPlay: Info = new Info(PlayerConstants.CMS_PLAYER_PLAY, null);
          that.listener(infoPlay);
          return 'data playing';

        case 'pause':
          console.log('pause event recieved');
          that.outPort1.postMessage('Pause Received In player');
          const infoPause: Info = new Info(PlayerConstants.CMS_PLAYER_PAUSE, null);
          that.listener(infoPause);
          return 'data pause';

        case 'close':
          console.log('close event recieved');
          that.outPort1.postMessage('Close Received In player');
          const infoClose: Info = new Info(PlayerConstants.CMS_PLAYER_CLOSE, null);
          that.listener(infoClose);
          return 'data Close';
      }
    });
  }

  connected() {
    console.log('ExternalcommunicationService: connected');
    // create a listener object
    const open = new BroadcastEventListener<any>('open');
    // register the listener
    this.connection.listen(open);

    // subscribe for incoming messages
    open.subscribe((value: any) => {
      console.log('ExternalcommunicationService: connected - open=', value);
      this.initValues = new InitDataReader().read(JSON.parse(value));
      this.dataLoadedSuccess();
      console.log('DataloaderService: loadData', this.initValues);
    });

    // create a listener object
    const cmsPlayerPlay = new BroadcastEventListener<any>(PlayerConstants.CMS_PLAYER_PLAY);
    // register the listener
    this.connection.listen(cmsPlayerPlay);
    // subscribe for incoming messages
    cmsPlayerPlay.subscribe((value: any) => {
      console.log('ExternalcommunicationService: connected - cmsPlayerPlay=', value);
      const info: Info = new Info(PlayerConstants.CMS_PLAYER_PLAY, value);
      this.listener(info);
    });

    // create a listener object
    const cmsPlayerPause = new BroadcastEventListener<any>(PlayerConstants.CMS_PLAYER_PAUSE);
    // register the listener
    this.connection.listen(cmsPlayerPause);
    // subscribe for incoming messages
    cmsPlayerPause.subscribe((value: any) => {
      console.log('ExternalcommunicationService: connected - cmsPlayerPause=', value);
      const info: Info = new Info(PlayerConstants.CMS_PLAYER_PAUSE, value);
      this.listener(info);
    });

    // create a listener object
    const cmsPlayerClose = new BroadcastEventListener<any>(PlayerConstants.CMS_PLAYER_CLOSE);
    // register the listener
    this.connection.listen(cmsPlayerPause);

    if ($.connection.hub && $.connection.hub.disconnected) {
      $.connection.hub.disconnected(() => {
        setTimeout(() => {
          console.log("Trying to re-establish connection");
          $.connection.hub.start();
        }, 5000); // Restart connection after 5 seconds.
      });
    }
    // subscribe for incoming messages
    cmsPlayerClose.subscribe((value: any) => {
      console.log('ExternalcommunicationService: connected - cmsPlayerClose=', value);
      const info: Info = new Info(PlayerConstants.CMS_PLAYER_CLOSE, value);
      this.listener(info);
    });
  }


  loadData(data, listener, success, failure) {
    this.listener = listener;
    this.success = success;
    this.failure = failure;
    console.log('loadData function');
    this.connect();
  }

  sendData(id: string, data: any) {
    console.log('this is console.log from send data function');
    if (this.initData && !this.initData.environment.lms.contentInParam && this.initData.environment.platform != 'electron' && this.initData.environment.platform != 'android') {
      this.call(id, [JSON.stringify(data)]);
    }
    else if (this.initData.environment.platform === 'electron') {
      console.log('electron 1111->', data)
      this.PostmessagecommunicationService.sendEventToPlayerHub(id, data)
    } else if (this.initData.environment.platform === 'android') {
      console.log('1111->', data)
      // this.PostmessagecommunicationService.sendEventToPlayerHub(id, data)


      let msg = {
        'method': data.event.action,
        'data': data
      }
      this.outPort1.postMessage('shailesh msg' + data.event.action);
      this.outPort1.postMessage(JSON.stringify(msg));
      console.log('external communication 1')
     // this.outPort1.postMessage(JSON.stringify(msg), '*');
    }
    //provision to send multiple events here
    //electron handle send different events to playerHUB from here
  }

  dataLoadedSuccess() {
    this.success(this.initValues);
  }

  dataLoadedFailure() {
    throw new Error('Method not implemented.');
  }
}
