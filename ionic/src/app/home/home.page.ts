import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CircuitService} from '../shared/services/circuit/circuit.service';
import { LoadingController } from '@ionic/angular';
import { ConversationService } from '../shared/services/conversation/conversation.service';
import { Supporter } from '../models/supporter';
import { SupportRequest } from '../models/supportRequest';
import { Ticket } from '../models/ticket';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  participants = [];
  supporter: Supporter = {email : ''};
  request: SupportRequest = {id: '', subject: '', description: ''};
  ticket: Ticket = {userId: '', convId: '', threadId: ''};
  uuid: string;
  threadId = '';
  ticketSet = true;

  user: any;
  threads = []; // all threads of conversation
  thread = [];   // current thread of conversation
  items = [];   // all items of current thread
  messageInput: string;

  container: HTMLElement;

  @ViewChild('scrollChat', {static: false}) private chat: ElementRef<any>;
  constructor(
      public loadingController: LoadingController,
      public circuitService: CircuitService,
      public conversationService: ConversationService
  ) {
    this.user = this.circuitService.loggedOnUser;
    this.conversationService.currentUUID.subscribe( res => this.uuid = res);
  }

  ngOnInit() {
    this.presentLoadingWithOptions();
    this.circuitService.authenticateUser();
    this.conversationService.currentSupporter.subscribe(supporter => this.supporter = supporter);
    this.conversationService.currentRequest.pipe(first()).subscribe( request => this.request = request);
    this.startNewChat(this.request.subject, this.request.description);
    this.circuitService.loggedIn.subscribe(value => {
      if (value) {
        this.setThreadsOfConversation();
      }
    });
    // TODO itemUpdated event should be added, so all messages are getting loaded properly
    this.circuitService.addEventListener('itemAdded', () => {
      this.setThreadsOfConversation();
    });
  }

  async setThreadsOfConversation() {
    const threadObject = await this.circuitService.getConversation(
      this.supporter.email
    );
    this.threads = threadObject.threads;
    await this.getCurrentThread(this.request.subject, this.request.description);
    if (this.thread[0].comments[0]) {
      this.items = await this.getMessagesFromCurrentThread();
    }
    this.getParticipants();
    this.onLoaded();
  }

  onLoaded() {
    const checkParticipants = setInterval(() => {
      if (this.participants) {
        clearInterval(checkParticipants);
        this.loadingController.getTop().then(v => v ? this.loadingController.dismiss() : null);
        this.scrollDown();
      }
    }, 100);
  }

  getCurrentThread(subject: string, description: string) {
    for (const i in this.threads) {
      if (this.threads[i].parentItem.type === 'TEXT') {
        if (this.threads[i].parentItem.text.subject === subject && this.threads[i].parentItem.text.content === description) {
          this.thread.pop();
          this.thread.push(this.threads[i]);
          this.threadId = this.thread[0].parentItem.itemId;
          if (!this.ticketSet) {
            this.setTicket();
            this.ticketSet = true;
          }
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

  startNewChat(subject: string, content: string) {
    this.circuitService.getConversation(this.supporter.email).then(res => {
            const threadObject = res;
            this.threads = threadObject.threads;
            this.sendTopicMessage(subject, content);
            this.ticketSet = false;
        }
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
      return this.circuitService
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

  setTicket() {
      this.ticket = {userId: this.uuid, convId: this.circuitService.convId, threadId: this.threadId};
      this.conversationService.addTicket('/spring/addTicket', this.ticket).subscribe();
  }

  scrollDown() {
    this.container = document.getElementById('chat');
    this.container.scrollTop = this.container.scrollHeight;
  }
}
