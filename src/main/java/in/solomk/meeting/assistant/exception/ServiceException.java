package in.solomk.meeting.assistant.exception;

public class ServiceException extends RuntimeException {

    public ServiceException(String message, Object... args) {
        super(format(message, args));
    }

    public ServiceException(Throwable cause, String message, Object... args) {
        super(format(message, args), cause);
    }

    private static String format(String message, Object... args) {
        if (args.length == 0) return message;
        return message.formatted(args);
    }
}
