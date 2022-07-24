import React from 'react';
import {useNavigate} from "react-router-dom";
import {meetingClient} from "../../client/meeting-client";

function Home() {
    let navigate = useNavigate();
    const client = meetingClient()

    async function navigateToCreatedMeeting() {
        const id = await client.createMeeting()
        navigate(`/meeting/${id}`)
    }

    return (
        <>
            <p>Here goes brief description. Click the button</p>
            <button
                onClick={navigateToCreatedMeeting}
            >
                Create Meeting
            </button>
        </>
    )
        ;
}

export default Home;
