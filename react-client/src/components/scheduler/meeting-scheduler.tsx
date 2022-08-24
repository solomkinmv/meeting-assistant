import 'devextreme/dist/css/dx.light.css';

import {Editing, Resource, Scheduler, View} from 'devextreme-react/scheduler';
import './meeting-scheduler.css'
import React, {useCallback, useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {meetingClient} from "../../client/meeting-client";
import {Meeting} from "../../client/model/meeting";
import {Interval} from "../../client/model/interval";
import {
    Appointment,
    AppointmentAddingEvent,
    AppointmentDeletingEvent,
    AppointmentFormOpeningEvent,
    AppointmentUpdatingEvent
} from "devextreme/ui/scheduler";
import {ResourceRecord} from "./resource-record";
import {getColor} from "./color-generator";
import Intersections from "./intersections/intersections";

export default function MeetingScheduler() {

    const [currentDate, setCurrentDate] = useState(new Date());
    const handlePropertyChange = useCallback((e: any) => { // todo: what type is e?
        if (e.name === 'currentDate') {
            setCurrentDate(e.value);
        }
    }, [])

    const params = useParams();
    const navigate = useNavigate();
    const client = meetingClient();
    const [currentUsername, setUsername] = useState(sessionStorage.getItem("username") || "");
    const [userResources, setUserResources] = useState<ResourceRecord[]>([]);
    const meetingId = params.meetingId ?? "";
    const [meeting, setMeeting] = useState<Meeting>({
        id: meetingId,
        userIntervals: {},
        intersections: []
    } as Meeting);

    function updateMeeting(meeting: Meeting) {
        setMeeting(meeting);
        const updatedUserResources: ResourceRecord[] = Object.keys(meeting.userIntervals)
            .map((name, idx) => {
                return new ResourceRecord(name, name, getColor(idx));
            });
        setUserResources(updatedUserResources)
    }

    function convertIntervalToAppointment(username: string, interval: Interval, disabled: boolean): Appointment {
        return {
            allDay: false,
            startDate: new Date(interval.from),
            endDate: new Date(interval.to),
            text: username,
            disabled: disabled
        }
    }

    function convertUserIntervalsToAppointments(meeting: Meeting): Appointment[] {
        const appointments: Appointment[] = [];
        for (const [username, intervals] of Object.entries(meeting.userIntervals)) {
            for (const interval of intervals) {
                const disabled = username !== currentUsername;
                appointments.push(convertIntervalToAppointment(username, interval, disabled));
            }
        }
        console.log("Converted user intervals to appointments", appointments);
        return appointments;
    }

    async function onAppointmentAdding(e: AppointmentAddingEvent) {
        console.log("Appointment adding", e);
        const newInterval = new Interval((e.appointmentData.startDate as Date).getTime(), (e.appointmentData.endDate as Date).getTime());
        if (newInterval.from >= newInterval.to) {
            alert("Invalid interval")
            e.cancel = true;
            return
        }

        if (currentUsername === "") {
            alert("You must be logged in to add an appointment")
            e.cancel = true;
            return
        }
        const updatedMeeting = await client.addInterval(meetingId, currentUsername, newInterval)
        console.log("Updated meeting to", updatedMeeting);
        updateMeeting(updatedMeeting);
    }

    async function onAppointmentDeleting(e: AppointmentDeletingEvent) {
        console.log("Appointment deleting", e);
        const interval = new Interval((e.appointmentData.startDate as Date).getTime(), (e.appointmentData.endDate as Date).getTime());
        if (currentUsername === "") {
            alert("You must be logged in to delete an appointment")
            e.cancel = true;
            return
        }
        const updatedMeeting = await client.removeIntervals(meetingId, currentUsername, interval)
        console.log("Updated meeting to", updatedMeeting);
        updateMeeting(updatedMeeting);
    }

    async function onAppointmentUpdating(e: AppointmentUpdatingEvent) {
        console.log("Appointment updating", e);
        if (currentUsername === "") {
            alert("You must be logged in to update an appointment")
            e.cancel = true;
            return
        }
        const oldInterval = new Interval((e.oldData.startDate as Date).getTime(), (e.oldData.endDate as Date).getTime());
        await client.removeIntervals(meetingId, currentUsername, oldInterval);

        const newInterval = new Interval((e.newData.startDate as Date).getTime(), (e.newData.endDate as Date).getTime());
        const updatedMeetingAfterAdding = await client.addInterval(meetingId, currentUsername, newInterval);
        console.log("Updated meeting to", updatedMeetingAfterAdding);
        updateMeeting(updatedMeetingAfterAdding);
    }

    function onUsernameChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setUsername(value);
        sessionStorage.setItem("username", value);
    }

    function customizeAppointmentForm(e: AppointmentFormOpeningEvent) {
        const form = e.form;
        const mainGroup = form.itemOption('mainGroup');
        let mainGroupItems: any[] = mainGroup.items;
        mainGroupItems.forEach((item: any) => {
            if (item.dataField === 'description' || item.dataField === 'text' || item.itemType === 'empty') {
                item.visible = false;
                console.log("Hiding description", item);
            }
            if (item.itemType === 'group') {
                item.items.forEach((subItem: any) => {
                    if (subItem.dataField === 'repeat') {
                        subItem.visible = false;
                    }
                });
            }
            return item;
        })

        form.repaint();

        console.log("Appointment form opening", e);
    }

    const fetchMeeting = useCallback(async () => {
        console.info("Fetching meeting", meetingId);
        try {
            return await client.getMeeting(meetingId);
        } catch (NotFoundError) {
            navigate("/404");
        }
    }, [meetingId, client, navigate]);

    useEffect(() => {

        fetchMeeting()
            .then(meeting => updateMeeting(meeting!))
            // make sure to catch any error
            .catch(console.error);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div>
                <Link to={`/meeting/${meetingId}`}>Visit text based meeting scheduler</Link>
            </div>
            <h1>Scheduler</h1>
            <div>
                <label htmlFor="name">Username:</label>
                <input autoComplete="off" placeholder="username" type="text" value={currentUsername}
                       onChange={onUsernameChanged}/>
            </div>
            <div className="wrapper">
                <div className="scheduler">
                    <Scheduler id="scheduler"
                               dataSource={convertUserIntervalsToAppointments(meeting)}
                               currentDate={currentDate}
                               onOptionChanged={handlePropertyChange}
                               adaptivityEnabled={true}
                               allDayPanelMode="allDay"
                               onAppointmentAdding={onAppointmentAdding}
                               onAppointmentDeleting={onAppointmentDeleting}
                               onAppointmentUpdating={onAppointmentUpdating}
                               defaultCurrentView="week"
                               showCurrentTimeIndicator={true}
                               onAppointmentFormOpening={customizeAppointmentForm}
                    >
                        <View
                            type="day"
                        />
                        <View
                            type="week"
                        />
                        <View type="month"/>
                        <View type="agenda"/>
                        <Resource
                            dataSource={userResources}
                            fieldExpr="text"
                            label="Users"
                            useColorAsDefault={false}
                        />
                        <Editing
                            allowDragging={true}
                            allowTimeZoneEditing={true}
                        />
                    </Scheduler>
                </div>
                <div className="intersections">
                    <Intersections intervals={meeting.intersections}/>
                </div>
            </div>
        </>
    )
}
