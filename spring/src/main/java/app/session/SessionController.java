package app.session;

import app.model.Ticket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class SessionController {

    @Autowired
    SessionRepository sessionRepository;

    @RequestMapping(value = "/getTickets", method = RequestMethod.GET)
    public List<Ticket> getTickets (@RequestParam(value="userId") String userId) {
        return sessionRepository.findByUserId(userId);
    }

    @RequestMapping(value = "/addTicket", consumes = "application/json", method = RequestMethod.POST)
    public void addTicket (@RequestBody Ticket ticket) {
        sessionRepository.save(ticket);
    }

}
