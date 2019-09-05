package app;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
public class SupportController {

    @MessageMapping("/get/supporter")   //If send to this usw prefix /app
    @SendTo("/topic/freesupporter")     //to subscribe to this, /topic/freeupporter
    public Supporter getSupporter(){
        return new Supporter("Frank.Rot86@mailinator.com");
    }

}
