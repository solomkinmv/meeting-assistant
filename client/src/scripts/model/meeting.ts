import {Interval} from "./interval"

export interface Meeting {
    id: string
    userIntervals: Record<string, Interval[]>
    intersections: [Interval]
}
