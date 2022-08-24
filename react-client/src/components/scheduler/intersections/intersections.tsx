import {Scheduler, View} from "devextreme-react/scheduler";
import {Interval} from "../../../client/model/interval";
import {Appointment} from "devextreme/ui/scheduler";
import React from "react";
import './intersections.css'

export interface IntersectionsProperties {
    readonly intervals: ReadonlyArray<Interval>
}

export default function Intersections(props: IntersectionsProperties) {
    const intervals: ReadonlyArray<Interval> = props.intervals
    const currentDate: Date = intervals.length === 0 ? new Date() : new Date(intervals[0].from)

    const intersectionAppointments: Appointment[] = intervals.map(interval => convertIntervalToAppointment(interval))

    function convertIntervalToAppointment(interval: Interval): Appointment {
        return {
            allDay: false,
            startDate: new Date(interval.from),
            endDate: new Date(interval.to),
            disabled: true
        }
    }

    return (
        <>
            <Scheduler
                id="intersection-summary"
                className="intersection-summary"
                dataSource={intersectionAppointments}
                currentDate={currentDate}
                defaultCurrentView="agenda">
                <View type="agenda"
                      agendaDuration={3650}
                />
            </Scheduler>
        </>
    )
}
