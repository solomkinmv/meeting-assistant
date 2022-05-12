import {Interval} from "./interval";

export class Meeting {
    id: string;
    userIntervals: Map<String, Interval[]>;
    intersections: [Interval];

    constructor(id: string, userIntervals: Map<String, Interval[]>, intersections: [Interval]) {
        this.id = id;
        this.userIntervals = userIntervals;
        this.intersections = intersections;
    }
}
