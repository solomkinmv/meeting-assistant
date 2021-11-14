package in.solomk.meeting.assistant.exception;

public class PersistenceException extends ServiceException {

    public PersistenceException(String message, Object... args) {
        super(message, args);
    }

    public PersistenceException(Throwable cause, String message, Object... args) {
        super(cause, message, args);
    }
}
