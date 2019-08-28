import { Component, OnInit } from '@angular/core';
import { CircuitService} from '../shared/services/circuit/circuit.service';
import { Message } from '../models/message';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  messages: Message[];

  constructor(
      private circuitService: CircuitService
  ) {}

  ngOnInit() {
    this.messages = this.circuitService.getMessages();
  }

  sendMessage() {
  }

}
