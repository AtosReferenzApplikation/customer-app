import {Injectable, OnInit} from '@angular/core';
import { SupportRequest } from '../../../models/supportRequest';
import { Supporter } from '../../../models/supporter';
import { Ticket } from '../../../models/ticket';
import { BehaviorSubject } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import * as uuid from 'uuid';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ConversationService implements OnInit {

  request: SupportRequest = {id: '', subject: '', description: ''};
  supporter: Supporter = {email: ''};

  uuid: string;
  private _UUID = new BehaviorSubject(this.uuid);
  currentUUID = this._UUID.asObservable();

  private requestData = new BehaviorSubject(this.request);
  private supporterData = new BehaviorSubject(this.supporter);
  currentRequest = this.requestData.asObservable();
  currentSupporter = this.supporterData.asObservable();

  constructor(private http: HttpClient,
              private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    this.checkUUID();
  }

  changeSupporter(supporter: Supporter) {
    this.supporterData.next(supporter);
  }

  changeRequest(request: SupportRequest) {
    this.requestData.next(request);
  }

  addTicket(url: string, data: Ticket) {
    return this.http.post<any>(url, data, httpOptions);
  }

  getTickets() {
  }

  checkUUID() {
    if (this.cookieService.check('UUID')) {
      this._UUID.next(this.cookieService.get('UUID'));
    } else {
      this._UUID.next(uuid.v4());
      this.cookieService.set('UUID', this._UUID.getValue());
    }
  }

}
