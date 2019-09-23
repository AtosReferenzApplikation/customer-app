import { Injectable } from '@angular/core';
import { SupportRequest } from '../../../models/supportRequest';
import { Supporter } from '../../../models/supporter';
import { Ticket } from '../../../models/ticket';
import { BehaviorSubject } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  request: SupportRequest = {id: '', subject: '', description: ''};
  supporter: Supporter = {email: ''};

  private requestData = new BehaviorSubject(this.request);
  private supporterData = new BehaviorSubject(this.supporter);
  currentRequest = this.requestData.asObservable();
  currentSupporter = this.supporterData.asObservable();

  constructor(private http: HttpClient) { }

  changeSupporter(supporter: Supporter) {
    this.supporterData.next(supporter);
  }

  changeRequest(request: SupportRequest) {
    this.requestData.next(request);
  }

  addTicket(url: string, data: Ticket) {
    return this.http.post<Ticket>(url, data, httpOptions);
  }

  getTickets() {
  }

}
