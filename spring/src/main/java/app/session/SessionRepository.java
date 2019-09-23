package app.session;

import org.springframework.data.cassandra.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;
import app.model.Ticket;

public interface SessionRepository extends CrudRepository<Ticket, String> {

    @Query("SELECT * FROM ticket WHERE userId= :val ALLOW FILTERING")
    public List<Ticket> findByUserId(@Param("val") String val);

}
