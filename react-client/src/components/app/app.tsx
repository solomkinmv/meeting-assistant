import React from 'react';
import {Link, Outlet} from "react-router-dom";
import './app.css';

function App() {
    return (
        <div className="app">
            <h1>Meeting Assistant</h1>
            <nav
                style={{
                    borderBottom: "solid 1px",
                    paddingBottom: "1rem",
                }}
            >
                <Link to="/">Home</Link> | {" "}
                <Link to="/about">About</Link>
            </nav>
            <Outlet/>
        </div>
    );
}

export default App;
