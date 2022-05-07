import {Interval} from "./interval";

export class Meeting {
    id: string;
    userIntervals: Map<String, Interval[]>;
    intersections: [Interval];
}
