import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SAMPLE_MESSAGES } from '../../sample-messages';

import Circuit from 'circuit-sdk';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CircuitService {

  private adress: 'localhost';
  private clientID: '92ccfac7cddc48288a134e963e6b782f';
  private domain: 'circuitsandbox.net';

  // SDK declarations
  client; // Circuit SDK instance
  user: any;  // Logged on user

  // BehaviorSubjects
  public loggedIn = new BehaviorSubject(false);

  constructor(private http: HttpClient) {
    // Set Circuit SDK internal log level
    Circuit.logger.setLevel(Circuit.Enums.LogLevel.Debug);
    this.getAccessToken();
    const client = new Circuit.Client({
      client_id: '92ccfac7cddc48288a134e963e6b782f',
      domain: 'circuitsandbox.net'
    });
    client.logon({accessToken: 'ZnJhbmsucm90ODZAbWFpbGluYXRvci5jb206RHIuTWFjazQ1OjkyY2NmYWM3Y2RkYzQ4Mjg4YTEzNGU5NjNlNmI3ODJm'})
       .then(user => console.log('Logged on as ' + user.displayName));
  }

  // Get all messages
  getMessages() {
    return SAMPLE_MESSAGES;
  }

  get loggedOnUser() {
    return this.client.loggedOnUser;
  }

  /*** Auth ***/
  // get token from Guest-Pool
  getAccessToken() {
    this.http.get('http://localhost:8080/token?clientId=92ccfac7cddc48288a134e963e6b782f&domain=circuitsandbox.net')
        .subscribe((data) => {
          const token = data['token'];
          console.log(token);
          localStorage.setItem('access_token', token);
        });
  }

  // try to logon with token from LocalStorage
  authenticateUser() {
    this.loggedIn.next(false);
    return this.logonWithToken();
  }

  validateAccessToken() {
    return this.client
        .validateToken(localStorage.getItem('access_token'))
        .then(() => this.logonWithToken());
        // .catch (() => this.logonPopup());
  }

  // logon to circuit using access token stored in localStorage
  logonWithToken() {
    return this.client
        .logon({
          accessToken: localStorage.getItem('access_token'),
          prompt: false
        })
        .then(user => {
          this.loggedIn.next(true);
          return user;
        })
        .catch(err => {
          return Promise.reject(err);
        });
  }




}
