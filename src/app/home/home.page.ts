import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CircuitService} from '../shared/services/circuit/circuit.service';
import {Router} from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ConversationService } from '../shared/services/conversation/conversation.service';
import { Supporter } from '../models/supporter';
import {SupportRequest} from '../models/supportRequest';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  participants = [];
  supporter: Supporter = {email : ''};
  request: SupportRequest = {subject: '', description: ''}

  user: any;
  threads = []; // all threads of conversation
  thread = [];   // current thread of conversation
  items = [];   // all items of current thread
  messageInput: string;


  subject = 'Test'; // TODO use SupportRequest model to get information about the request
  description = 'Problem bei ....';

  constructor(
      public loadingController: LoadingController,
      public circuitService: CircuitService,
      private router: Router,
      public conversationService: ConversationService
  ) {
    this.user = this.circuitService.loggedOnUser;
  }

  ngOnInit() {
    this.presentLoadingWithOptions();
    this.circuitService.authenticateUser();
    this.conversationService.currentSupporter.subscribe(supporter => this.supporter = supporter);
    this.conversationService.currentRequest.pipe(first()).subscribe( request => this.request = request);
    this.circuitService.loggedIn.subscribe(value => {
      if (value) {
        this.setThreadsOfConversation();
      }
    });

    // TODO Scroll Chat window down, if new message is added
    this.circuitService.addEventListener('itemAdded', () => {
      this.setThreadsOfConversation();
    });
  }

  async setThreadsOfConversation() {
    console.log(this.request.subject);
    console.log(this.request.description);
    const threadObject = await this.circuitService.getConversation(
      this.supporter.email
    );
    this.threads = threadObject.threads;
    await this.getCurrentThread(this.subject, this.description);
    this.items = await this.getMessagesFromCurrentThread();
    this.getParticipants();
    this.onLoaded();
  }

  onLoaded() {
    const checkParticipants = setInterval(() => {
      if (this.participants) {
        clearInterval(checkParticipants);
        this.loadingController.dismiss();
      }
    }, 100);
  }

  getCurrentThread(subject: string, description: string) {
    for (const i in this.threads) {
      if (this.threads[i].parentItem.type === 'TEXT') {
        if (this.threads[i].parentItem.text.subject === subject) {
          this.thread.pop();
          this.thread.push(this.threads[i]);
        }
      }
    }
  }

  getMessagesFromCurrentThread() {
    return this.circuitService.getMessagesByThread(
        this.circuitService.conversation.convId,
        this.thread[0].parentItem.itemId
    );
  }

  getParticipants() {
    this.circuitService.conversation.participants.forEach(userId => {
      this.circuitService
          .getUserById(userId)
          .then((res: any) => this.participants.push(res));
    });
  }

  getParticipantById(id: any) {
    try {
      return this.participants[
          this.participants.findIndex(user => user.userId === id)
          ].displayName;
    } catch {
      return 'Name not found';
    }
  }

  redirect() {
    this.router.navigate(['']);
  }

  sendMessage(content: string, thread: any) {
    console.log(content);
    if (content.trim() !== '') {
      this.circuitService.sendMessage({
        parentId: thread.parentItem.itemId,
        content
      });
    }
    this.messageInput = '';
  }

  sendTopicMessage(subject: string, content: string) {
    if (subject !== '') {
      this.circuitService
          .sendMessage({ subject, content });
    }
  }

  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: 'bubbles',
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }

}
