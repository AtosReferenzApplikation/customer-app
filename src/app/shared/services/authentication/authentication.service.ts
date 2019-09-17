import { Injectable } from '@angular/core';
import { CircuitService } from '../circuit/circuit.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isLoggedIn = false;
  redirectUrl: string;

  constructor(
      private circuitService: CircuitService
  ) {
    this.circuitService.loggedIn.subscribe(res => this.isLoggedIn = res);
  }

  logon() {
    return this.circuitService.authenticateUser();
  }

  logout() {
    return this.circuitService.logout();
  }
}
