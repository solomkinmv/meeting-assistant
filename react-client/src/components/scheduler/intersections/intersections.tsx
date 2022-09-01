import {Interval} from "../../../client/model/interval";
import React from "react";
import './intersections.css'

export interface IntersectionsProperties {
    readonly intervals: ReadonlyArray<Interval>
}

export default function Intersections(props: IntersectionsProperties) {
    const intervals: ReadonlyArray<Interval> = props.intervals
    const separatedIntervals = intervals.flatMap(interval => splitIntervalByDays(interval.from, interval.to));
    const groupedIntervalsList = groupIntervals(separatedIntervals)

    return (
        <div className="intersection-wrapper">
            <h2 className="intersection-header">Intersections:</h2>
            {groupedIntervalsList.map(groupIntervals => {
                return (<>
                        <div className="intersection-date">{formatDate(groupIntervals.date)}</div>
                        {renderGroupIntervals(groupIntervals.intervals)}
                    </>
                )
            })}
        </div>
    )
}

function renderGroupIntervals(intervals: Interval[]) {
    if (intervals[0].from == intervals[0].to) {
        return
    }
    return (
        <div className="intersection-date-slots">
            {intervals.map(interval => {
                return <div>{formatTimeFromTimestamp(interval.from)} - {formatTimeFromTimestamp(interval.to)}</div>
            })}
        </div>
    )
}

function splitIntervalByDays(from: number, to: number): Interval[] {
    const endDate: Date = new Date(to)
    let startDate: Date = new Date(from)
    const result: Interval[] = []
    while (startDate < endDate && startDate.getDay() != endDate.getDay()) {
        const nextDate = new Date(startDate)
        nextDate.setHours(0, 0, 0, 0)

        result.push(new Interval(startDate.getTime(), nextDate.getTime()))

        nextDate.setDate(nextDate.getDate() + 1)
        startDate = nextDate;
    }
    if (startDate < endDate) {
        result.push(new Interval(startDate.getTime(), endDate.getTime()))
    }
    return result
}

function groupIntervals(intervals: Interval[]): GroupedIntervals[] {
    let previousDate: Date | null = null
    let previousGroup: GroupedIntervals
    const result: GroupedIntervals[] = []
    intervals.forEach(interval => {
        const date = trimTime(new Date(interval.from))
        if (previousDate?.getTime() !== date.getTime()) {
            previousDate = date
            previousGroup = new GroupedIntervals(date, [])
            result.push(previousGroup)
        }
        previousGroup.intervals.push(interval)
    })

    return result
}

function trimTime(date: Date): Date {
    console.log("Trimming time", date)
    const result: Date = new Date(date)
    result.setHours(0, 0, 0, 0)
    console.log("Trimmed time", result)
    return result
}

function formatDate(date: Date): string {
    return date.toLocaleDateString([], {
        day: '2-digit',
        month: 'long',
        year: '2-digit',
        // hour: '2-digit',
        // minute: '2-digit'
    })
}

function formatTimeFromTimestamp(date: number): string {
    return new Date(date).toLocaleTimeString()
}

class GroupedIntervals {
    constructor(readonly date: Date, readonly intervals: Interval[]) {
    }
}
