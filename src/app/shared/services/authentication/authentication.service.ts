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
    this.circuitService.loggedIn.subscribe(
        loggedIn => this.isLoggedIn = loggedIn
    );
  }

  logon() {
    return this.circuitService.authenticateUser();
  }

}
