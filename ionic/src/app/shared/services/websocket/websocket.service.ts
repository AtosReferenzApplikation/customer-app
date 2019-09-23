import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Client, Message, over, StompSubscription } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from '../../../../environments/environment';
import { filter, first, switchMap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { WebsocketState } from './websocket-state';

@Injectable({
    providedIn: 'root'
})
export class WebsocketService implements OnDestroy {

    private client: Client;
    private state: BehaviorSubject<WebsocketState>;

    constructor() {
        this.client = over(new SockJS(environment.api));
        this.state = new BehaviorSubject<WebsocketState>(WebsocketState.ATTEMPTING);
        this.client.connect({}, () => {
            this.state.next(WebsocketState.CONNECTED);
        });
    }

    private connect(): Observable<Client> {
        return new Observable<Client>(observer => {
            this.state.pipe(filter(state => state === WebsocketState.CONNECTED)).subscribe(() => {
                observer.next(this.client);
            });
        });
    }

    ngOnDestroy() {
        this.connect().pipe(first()).subscribe(client => client.disconnect(null));
    }

    // sending message
    send(topic: string, payload: any): void {
        this.connect()
            .pipe(first())
            .subscribe(inst => inst.send(topic, {}, JSON.stringify(payload)));
    }

    // retrieve messages from topic
    onMessage(topic: string): Observable<any> {
        return this.connect().pipe(first(), switchMap(client => {
            return new Observable<any>(observer => {
                const subscription: StompSubscription = client.subscribe(topic, message => {
                    observer.next(message.body);
                });
                return () => client.unsubscribe(subscription.id);
            });
        }));
    }
}
