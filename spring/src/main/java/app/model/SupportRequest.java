package app;

public class SupportRequest {

    private String subject;

    private String description;

    public SupportRequest() {}

    public SupportRequest(String subject) {
        this.subject = subject;
    }

    public SupportRequest(String subject, String description) {
        this.subject = subject;
        this.description = description;
    }

    public String getSubject() {
        return this.subject;
    }

    public String getDescription() {
        return this.description;
    }
}
