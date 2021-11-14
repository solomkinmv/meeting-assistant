package in.solomk.meeting.assistant.util;

import java.util.Collection;
import java.util.List;
import java.util.function.Function;

public final class ConversionUtils {

    public static <T, R> List<R> mapToList(Collection<T> collection, Function<T, R> mappingFunction) {
        return collection.stream()
                         .map(mappingFunction)
                         .toList();
    }
}
