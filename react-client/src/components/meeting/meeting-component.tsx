import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {meetingClient} from "../../client/meeting-client";
import {Meeting} from "../../client/model/meeting";
import {Interval} from "../../client/model/interval";
import {useMeetingService} from "./meeting-service";

export default function MeetingComponent() {
    const params = useParams();
    const navigate = useNavigate();
    const client = meetingClient();
    const meetingService = useMeetingService();
    const [intervalStart, setIntervalStart] = useState("");
    const [intervalEnd, setIntervalEnd] = useState("");
    const [currentUsername, setUsername] = useState(sessionStorage.getItem("username") || "");
    const meetingId = params.meetingId ?? "";
    const [meeting, setMeeting] = useState<Meeting>({
        id: meetingId,
        userIntervals: {},
        intersections: []
    } as Meeting);

    async function addInterval() {
        console.log(currentUsername, intervalStart, intervalEnd);
        const newInterval = new Interval(parseDate(intervalStart), parseDate(intervalEnd));
        if (newInterval.from >= newInterval.to) {
            alert("Invalid interval")
            return
        }

        const updatedMeeting = await client.addInterval(meetingId, currentUsername, newInterval);
        console.log("Updated meeting to", updatedMeeting);
        setMeeting(updatedMeeting);
    }

    async function onDelete(index: number) {
        const updatedIntervals = meetingService.filterUserIntervals(meeting, currentUsername, index);
        const updatedMeeting = await client.setIntervals(meetingId, currentUsername, updatedIntervals);
        console.log("Updated meeting to", updatedMeeting);
        setMeeting(updatedMeeting);
    }

    function onUsernameChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setUsername(value);
        sessionStorage.setItem("username", value);
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
            .then(meeting => setMeeting(meeting!))
            // make sure to catch any error
            .catch(console.error);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <h1>Meeting Page Here for meeting {meetingId}</h1>
            <label htmlFor="name">Username:</label>
            <input autoComplete="off" placeholder="username" type="text" value={currentUsername}
                   onChange={onUsernameChanged}/>

            <div id="intervals">
                <h2>Intervals:</h2>
                {
                    Object.keys(meeting.userIntervals)
                        .map(username => {
                            const intervals = meeting.userIntervals[username];

                            return (<div key={username}>
                                <h3>{username}</h3>
                                <table>
                                    <tbody>
                                    {intervals.map((interval, index) => {
                                        return (<tr key={interval.from}>
                                            <td>{formatDate(interval.from)}</td>
                                            <td>{formatDate(interval.to)}</td>
                                            <td>
                                                {username === currentUsername ?
                                                    <button onClick={() => onDelete(index)}>Delete</button> : null}
                                            </td>
                                        </tr>)
                                    })}
                                    </tbody>
                                </table>
                            </div>)
                        })
                }
            </div>
            <div id="intersections">
                <h2>Intersections:</h2>
                {
                    <table>
                        <tbody>
                        {meeting.intersections
                            .map(interval => {
                                return (<tr key={interval.from}>
                                    <td>{formatDate(interval.from)}</td>
                                    <td>{formatDate(interval.to)}</td>
                                </tr>)
                            })}
                        </tbody>
                    </table>
                }
            </div>

            <label htmlFor="intervalFrom">Interval start:</label>
            <input type="datetime-local" value={intervalStart}
                   onChange={event => setIntervalStart(event.target.value)}/>

            <label htmlFor="intervalTo">Interval end:</label>
            <input type="datetime-local" value={intervalEnd} onChange={event => setIntervalEnd(event.target.value)}/>
            <button onClick={addInterval}>Add interval</button>
        </div>
    );
}

function formatDate(date: number): string {
    return new Date(date).toLocaleDateString([], {
        day: '2-digit',
        month: 'numeric',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })
}

function parseDate(dateString: string): number {
    return new Date(dateString).getTime()
}
