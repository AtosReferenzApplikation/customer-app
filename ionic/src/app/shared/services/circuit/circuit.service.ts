import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Circuit from 'circuit-sdk';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageContent } from '../../../models/messageContent';

@Injectable({
  providedIn: 'root'
})
export class CircuitService {

  headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ');

  // SDK declarations
  client; // Circuit SDK instance
  user: any;  // Logged on user
  public conversation: any; // Active conversation object
  public convId: string;

  // BehaviorSubjects
  public loggedIn = new BehaviorSubject(false);

  // tslint:disable-next-line:ban-types
  public addEventListener: Function;

  // OAuth configuration
  oauthConfig = {
    domain: 'circuitsandbox.net',
    client_id: '7accbde69451477f98c395b9a35374bd',  // TODO move customer app and ServiceCenter to same sandbox
    redirect_uri: this.redirectUri,
    scope: 'READ_USER_PROFILE,' +
        'WRITE_USER_PROFILE,' +
        'READ_CONVERSATIONS,' +
        'WRITE_CONVERSATIONS,' +
        'READ_USER,' +
        'CALLS,' +
        'CALL_RECORDING,' +
        'MENTION_EVENT,' +
        'USER_MANAGEMENT'
  };

  constructor(private http: HttpClient, private router: Router) {
    // Set Circuit SDK internal log level
    // Circuit.logger.setLevel(Circuit.Enums.LogLevel.Debug);

    // create Circuit SDK client implicit
    this.client = new Circuit.Client ({
      client_id: this.oauthConfig.client_id,
      domain: this.oauthConfig.domain,
      scope: this.oauthConfig.scope,
      autoRenewToken: true
    });

    // bind event listener directly to SDK addEventListener
    this.addEventListener = this.client.addEventListener.bind(this);
  }

  /**
   * Logon to Circuit using OAuth2.
   * @returns A promise returning a the user
   */
  authenticateUser() {
    if (this.loggedIn.value === true) {
      return this.loggedOnUser;
    }
    this.loggedIn.next(false);
    return this.client.logon().then(user => {
      this.loggedIn.next(true);
      return user;
    }).catch(err => Promise.reject(err));
  }

  /**
   * Forces the logout
   * @returns An empty promise
   */
  logout() {
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
    return this.client.logout(true);
  }

  /**
   * Gets a user by his user id
   * @param userId - Circuit user ID
   * @returns A promise that returns the user
   */
  getUserById(userId: string) {
    return this.client.getUserById(userId);
  }

  /**
   * Get the direct conversation with a user. A conversation will be created. If the user is not logged in, he will be prompted to do so.
   * @param user - User ID or email address
   * @returns A promise returning a the conversation
   */
  getConversation(user: string) {
    return this.client
        .getDirectConversationWithUser(user, true)
        .then(conversation => {
          this.conversation = conversation;
          this.convId = conversation.convId;
          return this.client
              .getConversationFeed(conversation.convId)
              .then(conv => conv);
        })
        .catch(() => {
          if (!this.loggedIn.value) {
            this.authenticateUser();
          }
        });
  }

  /**
   * Get all messages of a thread
   */
  getMessagesByThread(convId: string, threadId: string) {
    return this.client
        .getItemsByThread(convId, threadId)
        .then( items => items);
  }

  /**
   * Sends a message to a conversation. If the user is not logged in, he will be prompted to do so.
   * @param  content - User ID or email address
   * @returns  A promise returning a the message
   */
  sendMessage(content: MessageContent) {
    return this.client
        .addTextItem(this.conversation.convId, content)
        .then(item => {
          return {
            client: this.client,
            conv: this.conversation,
            item
          };
        })
        .catch(() => {
          if (!this.loggedIn.value) {
            this.authenticateUser();
          }
        });
  }

  /**********
   *  Misc
   **********/
  get loggedOnUser() {
    return this.client.loggedOnUser;
  }

  get redirectUri() {
    return window.location.href;
  }
}
