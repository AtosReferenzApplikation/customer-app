import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CircuitService} from '../shared/services/circuit/circuit.service';
import {Router} from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  worker = 'Frank.Rot86@mailinator.com';
  participants = [];

  loggedIn: boolean;
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
      private router: Router
  ) {
    this.user = this.circuitService.loggedOnUser;
  }

  ngOnInit() {
    this.presentLoadingWithOptions();
    this.circuitService.authenticateUser()
        .then();

    this.circuitService.loggedIn.subscribe(value => {
      if (value) {
        this.setThreadsOfConversation();
      }
    });
  }

  async setThreadsOfConversation() {
    const threadObject = await this.circuitService.getConversation(
        this.worker   // TODO implement get supporter with websocket
    );
    this.threads = threadObject.threads;
    await this.getCurrentThread(this.subject, this.description);
    this.items = await this.getMessagesFromCurrentThread();

    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    console.log(this.circuitService.conversation);
    console.log('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB');
    console.log(this.threads);
    console.log('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC');
    console.log(this.thread);
    console.log('DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD');
    console.log(this.items);

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
