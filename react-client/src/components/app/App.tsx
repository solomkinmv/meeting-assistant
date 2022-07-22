import React from 'react';
import {Link, Outlet} from "react-router-dom";
import './App.css';

function App() {
    return (
        <div className="App">
            <h1>Meeting Assistant</h1>
            <nav
                style={{
                    borderBottom: "solid 1px",
                    paddingBottom: "1rem",
                }}
            >
                <Link to="/meeting">Create meeting</Link> |{" "}
                <Link to="/404">Not Found</Link> | {" "}
                <Link to="/invoices">Invoices</Link> |{" "}
                <Link to="/expenses">Expenses</Link>
            </nav>
            <Outlet/>
        </div>
    );
}

export default App;
