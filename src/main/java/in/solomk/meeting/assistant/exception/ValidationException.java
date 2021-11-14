package in.solomk.meeting.assistant.exception;

public class ValidationException extends ServiceException {

    public ValidationException(String message, Object... args) {
        super(message, args);
    }

    public ValidationException(Throwable cause, String message, Object... args) {
        super(cause, message, args);
    }
}
