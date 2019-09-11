import { Injectable } from '@angular/core';
import { SupportRequest } from '../../../models/supportRequest';
import { Supporter } from '../../../models/supporter';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  request: SupportRequest = {subject: '', description: ''};
  supporter: Supporter = {email: ''};

  private requestData = new BehaviorSubject(this.request);
  private supporterData = new BehaviorSubject(this.supporter);
  currentRequest = this.requestData.asObservable();
  currentSupporter = this.supporterData.asObservable();

  constructor() { }

  changeSupporter(supporter: Supporter) {
    this.supporterData.next(supporter);
  }

  changeRequest(request: SupportRequest) {
    this.requestData.next(request);
  }
}
