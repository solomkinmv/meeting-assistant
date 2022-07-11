package in.solomk.meeting.assistant.util;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public final class ConversionUtils {

    public static <T, R> List<R> mapToList(Collection<T> collection, Function<T, R> mappingFunction) {
        if (collection == null) {
            return null;
        }
        return collection.stream()
                         .map(mappingFunction)
                         .toList();
    }

    public static <K, T, R> Map<K, R> mapValues(Map<K, T> map, Function<T, R> mappingFunction) {
        if (map == null) {
            return null;
        }
        return map.entrySet()
                  .stream()
                  .collect(Collectors.toMap(Map.Entry::getKey, entry -> mappingFunction.apply(entry.getValue())));
    }
}
