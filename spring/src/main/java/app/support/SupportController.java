package app.support;

import app.model.SupportRequest;
import app.model.Supporter;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SupportController {

    @MessageMapping("/get/supporter")   //If send to this use prefix /app => /app/get/supporter
    @SendTo("/topic/requestSupporter")  //to subscribe to this, /topic/requestSupporter
    public SupportRequest getSupporter(@RequestBody SupportRequest supportRequest) {
        return supportRequest;
    }

    /*
    // returns the supporter to the requesting client only
    @MessageMapping("/set/supporter")   //If send to this use prefix /app => /app/set/supporter
    @SendToUser("/queue/deliverSupporter/")  //to subscribe to this, /user/queue/deliverSupporter
    public Supporter setSupporter(@RequestBody Supporter supporter){
        return supporter;
    }
    */

    @MessageMapping("/set/supporter/{requestId}")
    @SendTo("/topic/deliverSupporter/{requestId}")
    public Supporter setSupporter(@RequestBody Supporter supporter) {
        return supporter;
    }
}
