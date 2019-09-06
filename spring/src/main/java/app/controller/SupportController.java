package app;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
public class SupportController {

    @MessageMapping("/get/supporter")   //If send to this use prefix /app
    @SendTo("/topic/requestSupporter")     //to subscribe to this, /topic/freeupporter
    public SupportRequest getSupporter(@RequestBody SupportRequest supportRequest){
        return supportRequest;
    }

    @MessageMapping("/set/supporter")
    @SendTo("/topic/deliverSupporter")
    public Supporter setSupporter(@RequestBody Supporter supporter){
        return supporter;
    }
}
