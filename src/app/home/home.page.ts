import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CircuitService} from '../shared/services/circuit/circuit.service';
import { Message } from '../models/message';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  worker = 'marvin.kohlmann@atos.net';
  participants = [];

  loggedIn: boolean;
  user: any;
  messages: Message[];
  threads = [];

  @ViewChild('scrollChat', {static: false}) private chat: ElementRef<any>;
  constructor(
      public circuitService: CircuitService,
      private router: Router
  ) {
    this.user = this.circuitService.loggedOnUser;
  }

  ngOnInit() {
    this.messages = this.circuitService.getMessages();
    this.circuitService.authenticateUser();
    this.circuitService.loggedIn.subscribe(value => {
      if (value) {
        console.log('AAAAAAAAAAAAA');
        console.log(this.circuitService.loggedIn.getValue());

        this.setThreadsOfConversation();
        /*
        this.circuitService.getConversation(this.worker)
            .then(r => console.log());*/
      }
    });
  }

  async setThreadsOfConversation() {
    const threadObject = await this.circuitService.getConversation(
        this.worker
    );
    this.threads = threadObject.threads;

  }

  sendMessage() {
  }

  redirect() {
    this.router.navigate(['']);
  }

}
