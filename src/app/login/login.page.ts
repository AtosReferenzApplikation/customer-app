import { Component, OnInit } from '@angular/core';
import { AuthenticationService} from '../shared/services/authentication/authentication.service';
import { Router } from '@angular/router';
import {CircuitService} from '../shared/services/circuit/circuit.service';
import { WebsocketService} from '../shared/services/websocket/websocket.service';
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
  request: SupportRequest = {subject: ''};
  supporter: Supporter;

  subject: string;
  description: string;

  constructor(
      public loadingController: LoadingController,
      public circuitService: CircuitService,
      public authService: AuthenticationService,
      private router: Router,
      private websocket: WebsocketService
  ) { }

  ngOnInit() {
    this.circuitService.loggedIn.subscribe(res => this.logedIn = res);
  }

  getAvailableSupporter() {
    this.presentLoadingWithOptions();
    this.request.subject = this.subject;
    this.websocket.send('/app/get/supporter', this.request);
    this.websocket
        .onMessage('/topic/deliverSupporter')
        .pipe(first())
        .subscribe(res => {
          this.supporter = JSON.parse(res);
          this.loadingController.dismiss();
        });
  }

  logon() {
    this.authService.logon()
        .then(() => {
          if (this.logedIn) {
            this.redirectUser();
          }
        });
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
