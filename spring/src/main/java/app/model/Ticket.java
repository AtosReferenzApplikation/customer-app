package app.model;

import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

@Table
public class Ticket {

    @PrimaryKey
    private String userId;
    private String convId;
    private String threadId;

    public Ticket(){}
    public Ticket(String convId, String threadId, String userId){
        this.convId = convId;
        this.threadId = threadId;
        this.userId = userId;
    }

    public String getUserId() {
        return this.userId;
    }
    public String getConvId() {
        return this.convId;
    }
    public String getThreadId() {
        return this.threadId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
    public void setConvId(String convId) {
        this.convId = convId;
    }
    public void setThreadId(String threadId) {
        this.threadId = threadId;
    }

    @Override
    public String toString(){
        return String.format("{'userId': %s, 'convId': %s, 'threadId': %s}", this.userId, this.convId, this.threadId);
    }
}
