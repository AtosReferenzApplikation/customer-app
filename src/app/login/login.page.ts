import { Component, OnInit } from '@angular/core';
import { AuthenticationService} from '../shared/services/authentication/authentication.service';
import { Router } from '@angular/router';
import {CircuitService} from '../shared/services/circuit/circuit.service';
import { WebsocketService} from '../shared/services/websocket/websocket.service';
import { ConversationService } from '../shared/services/conversation/conversation.service';
import { first } from 'rxjs/operators';

import { SupportRequest } from '../models/supportRequest';
import { Supporter } from '../models/supporter';
import {LoadingController} from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  logedIn: boolean;
  request: SupportRequest = {subject: '', description: ''};
  supporter: Supporter = {email : ''};

  subject: string;
  description: string;

  constructor(
      public loadingController: LoadingController,
      public circuitService: CircuitService,
      public authService: AuthenticationService,
      private router: Router,
      private websocket: WebsocketService,
      public conversationService: ConversationService
  ) { }

  ngOnInit() {
    this.circuitService.loggedIn.subscribe(res => this.logedIn = res);
  }

  startChat() {
    this.presentLoadingWithOptions();
    this.request.subject = this.subject;
    this.request.description = this.description;
    this.conversationService.changeRequest(this.request);
    this.websocket.send('/app/get/supporter', this.request);
    this.websocket
        .onMessage('/topic/deliverSupporter')
        .pipe(first())
        .subscribe(res => {
          this.supporter = JSON.parse(res);
          this.conversationService.changeSupporter(this.supporter);
          this.loadingController.dismiss();
          this.redirectUser();
        });

  }

  logon() {
    this.authService.logon();
  }

  logout() {
    this.authService.logout();
  }

  private redirectUser() {
    this.router.navigate(['support']);
  }

  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: 'bubbles',
      message: 'Der nächste freie Mitarbeiter wird sich um Sie kümmern.',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }
}
