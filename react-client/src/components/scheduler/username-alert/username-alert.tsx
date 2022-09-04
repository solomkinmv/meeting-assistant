import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import React, {useState} from "react";

interface UsernameAlertProperties {
    readonly alertOpen: boolean
    readonly setAlertOpen: (newAlertState: boolean) => void
    readonly onSave: (newUsername: string) => void
}

export default function UsernameAlert(props: UsernameAlertProperties) {
    const [username, setUsername] = useState("")

    function handleCancelAlert() {
        props.setAlertOpen(false)
        setUsername("")
    }

    function handleSaveAlert() {
        props.setAlertOpen(false)
        props.onSave(username)
        setUsername("")
    }

    function onUsernameChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setUsername(value);
    }

    return (
        <Dialog open={props.alertOpen} onClose={handleCancelAlert}>
            <DialogTitle>Please input username</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    To edit user appointments, please enter your username here.
                    For the new user please choose unique username.
                </DialogContentText>
                <TextField
                    id="outlined-textarea"
                    label="Username"
                    size="small"
                    value={username}
                    onChange={onUsernameChanged}
                    error={!username}
                    fullWidth={true}
                    margin="dense"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancelAlert}>Cancel</Button>
                <Button onClick={handleSaveAlert}>Save</Button>
            </DialogActions>
        </Dialog>
    )
}
