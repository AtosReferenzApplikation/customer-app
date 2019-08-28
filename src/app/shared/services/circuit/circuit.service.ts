import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SAMPLE_MESSAGES } from '../../sample-messages';
import Circuit from 'circuit-sdk';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CircuitService {
  authUri = 'https://circuitsandbox.net/oauth/authorize';
  restUri = 'https://circuitsandbox.net/rest/v2';

  headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + localStorage.getItem('access_token'));

  // SDK declarations
  client; // Circuit SDK instance
  user: any;  // Logged on user

  // BehaviorSubjects
  public loggedIn = new BehaviorSubject(false);

  // OAuth configuration
  oauthConfig = {
    domain: 'circuitsandbox.net',
    client_id: '7accbde69451477f98c395b9a35374bd',
    redirect_uri: this.redirectUri,
    scope: 'ALL'
  };

  constructor(private http: HttpClient) {
    // Set Circuit SDK internal log level
    Circuit.logger.setLevel(Circuit.Enums.LogLevel.Debug);

    // create Circuit SDK client implicit
    this.client = new Circuit.Client({
      client_id: this.oauthConfig.client_id,
      domain: this.oauthConfig.domain,
      scope: this.oauthConfig.scope,
      autoRenewToken: true
    });
  }

  /**************
   * CIRCUIT SDK
   **************/

  // try to logon with cached credentials/token
  authenticateUser() {
    this.loggedIn.next(false);
    return this.validateAccessToken();
  }

  validateAccessToken() {
    return this.client
        .validateToken(localStorage.getItem('access_token'))
        .then(() => this.logonWithToken())
        .catch(() => this.logonPopup());
  }

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

  logonPopup() {
    const state = Math.random()
        .toString(36)
        .substr(2, 15); // to prevent cross-site request forgery
    const url =
        this.authUri +
        '?response_type=token&client_id=' +
        this.oauthConfig.client_id +
        '&redirect_uri=' +
        this.redirectUri +
        '&scope=' +
        this.oauthConfig.scope +
        '&state=' +
        state; // auth request url

    const logonPopup = window.open(
        url, 'Circuit Authentication', 'centerscreen,location,resizable,alwaysRaised,width=400,height=504'
    );

    // close popup if user login was successful
    const checkLogon = setInterval(() => {
      try {
        if (logonPopup.location.href.includes('access_token=')) {
          const callbackUrl = logonPopup.location.href;
          clearInterval(checkLogon);
          logonPopup.close();
          const token = this.getValueFromString(
              'access_token',
              callbackUrl
          );
          localStorage.setItem('access_token', token);
          this.logonWithToken();
        }
      } catch (error) {} // todo: handle logon error
    }, 100);
  }

  getValueFromString(value: string, url: string) {
    value = value.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regexS = '[\\?&]' + value + '=([^&#]*)';
    const regex = new RegExp(regexS);
    const results = regex.exec(url);
    if (results == null) {
      return ''; // todo: handle logon error
    } else {
      return decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
  }

  /**********
   *  Misc
   **********/
  get redirectUri() {
    return window.location.href;
  }

  getMessages() {
    return SAMPLE_MESSAGES;
  }
}
