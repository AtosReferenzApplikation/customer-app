import { Component, OnInit } from '@angular/core';
import { AuthenticationService} from '../shared/services/authentication/authentication.service';
import { Router } from '@angular/router';
import {CircuitService} from '../shared/services/circuit/circuit.service';
import { WebsocketService} from '../shared/services/websocket/websocket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  logedIn: boolean;

  constructor(
      public circuitService: CircuitService,
      public authService: AuthenticationService,
      private router: Router,
      private websocket: WebsocketService
  ) { }

  ngOnInit() {
    this.circuitService.loggedIn.subscribe(res => this.logedIn = res);
  }

  test() {
    this.websocket.send('/app/get/supporter', 'Hier könnte ihre Werbung stehen!');
  }

  getFreeSupporter() {

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
}
