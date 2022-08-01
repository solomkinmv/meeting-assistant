package in.solomk.meeting.assistant.util;

import java.util.ArrayList;
import java.util.List;

public final class CollectionUtils {

    public static <T> List<T> append(List<T> list, T element) {
        if (list == null) {
            return List.of(element);
        }
        List<T> listCopy = new ArrayList<>(list);
        listCopy.add(element);
        return listCopy;
    }

}
