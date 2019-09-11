import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CircuitService } from './services/circuit/circuit.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService} from './services/authentication/authentication.service';
import { ConversationService} from './services/conversation/conversation.service';
import { WebsocketService} from './services/websocket/websocket.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    CircuitService,
    AuthenticationService,
    ConversationService,
    WebsocketService
  ]
})
export class SharedModule { }
