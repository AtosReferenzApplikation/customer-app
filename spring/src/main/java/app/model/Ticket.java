package app.model;

import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

@Table("tickets")
public class Ticket {

    @PrimaryKey
    private String userId;
    private String convId;
    private String threadId;

    public Ticket(){}
    public Ticket(String userId, String convId, String threadId){
        this.userId = userId;
        this.convId = convId;
        this.threadId = threadId;
    }

    public String getUserId() {
        return this.userId;
    }
    public String getConversationId() {
        return this.convId;
    }
    public String getThreadId() {
        return this.threadId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
    public void setConversationId(String conversationId) {
        this.convId = conversationId;
    }
    public void setThreadId(String threadId) {
        this.threadId = threadId;
    }

    @Override
    public String toString(){
        return String.format("{'userId': %s, 'convId': %s, 'threadId': %s}", this.userId, this.convId, this.threadId);
    }
}
