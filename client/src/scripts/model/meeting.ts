import {Interval} from "./interval"

export interface Meeting {
    readonly id: string
    readonly userIntervals: Record<string, ReadonlyArray<Interval>>
    readonly intersections: ReadonlyArray<Interval>
}
