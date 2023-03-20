import { Injectable, EventEmitter } from '@angular/core';
import { deepStrictEqual } from 'assert';


@Injectable({
  providedIn: 'root'
})
export class PostmessagecommunicationService {

  //public hubConnection: signalR.HubConnection;

  public startConnection = () => {
    //debugger;
    let msg = {
      'method': 'playerReady'
    }

    console.log('jyoti: this is running on electron start communication');
    window.parent.postMessage(msg, '*');
    // out_port.postMessage(msg, '*');
    // this.hubConnection = new signalR.HubConnectionBuilder()
    //                         .withUrl('http://localhost:10651/signalr')
    //                         .build();
    // this.hubConnection
    //   .start()
    //   .then(() => {
    //     console.log('Connection started');

    //     //Add listeners
    //     this.addListeners();

    //     // call player ready
    //     this.call('playerReady', null);

    //   })
    //   .catch(err => {
    //      console.log('Error while starting connection: ' + err);
    //   })
  }


  //send generic events to player
  sendEventToPlayerHub(id, data) {

    let msg = {
      'method': data.event.action,
      'data': data
    }
    console.log("id, data---------------------------------------------------->>>", id, data);
    window.parent.postMessage(msg, '*');
  }

  // private addListeners(){
  //   this.addTransferChartDataListener();
  // }

  // public addTransferChartDataListener = () => {
  //   this.hubConnection.on('transferchartdata', (data) => {
  //     //this.data = data;
  //     console.log(data);
  //   });
  // }

  // call(name: string, value: any[]) {
  //   console.log('Signal-R service: call - name=', name, 'value=', value);
  //   if (!value || value.length <= 0) {
  //     // invoke a server side method
  //     this.hubConnection.invoke(name).then((data: any[]) => {
  //       console.log('Signal-R service: call - data=', data);
  //     });

  //   } else {
  //     // invoke a server side method, with parameters
  //     this.hubConnection.invoke(name, ...value).then((data: any[]) => {
  //       console.log('Signal-R service: call - data=', data);
  //     });
  //   }
  // }
}
