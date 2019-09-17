package app;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.messaging.simp.annotation.SendToUser;

@RestController
public class SupportController {

    @MessageMapping("/get/supporter")   //If send to this use prefix /app => /app/get/supporter
    @SendTo("/topic/requestSupporter")  //to subscribe to this, /topic/requestSupporter
    public SupportRequest getSupporter(@RequestBody SupportRequest supportRequest){
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
    public Supporter setSupporter(@RequestBody Supporter supporter){
        return supporter;
    }
}
