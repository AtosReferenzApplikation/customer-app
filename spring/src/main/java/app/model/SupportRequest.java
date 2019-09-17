package app;

public class SupportRequest {

    private String id;
    private String subject;
    private String description;

    public SupportRequest() {}
    public SupportRequest(String id, String subject) {
        this.id = id;
        this.subject = subject;
    }
    public SupportRequest(String id, String subject, String description) {
        this.id = id;
        this.subject = subject;
        this.description = description;
    }

    public String getId() { return this.id; }
    public String getSubject() {
        return this.subject;
    }
    public String getDescription() {
        return this.description;
    }
}
