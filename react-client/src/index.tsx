import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import './index.css';
import App from './components/app/App';
import reportWebVitals from './reportWebVitals';
import Meeting from "./components/meeting/Meeting";
import NotFound from "./components/not-found/NotFound";
import Expenses from "./components/app/expenses";
import Invoices from "./components/app/invoices";
import Invoice from "./components/app/invoice";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>}>
                    <Route path='/meeting' element={<Meeting/>}/>
                    <Route path='/404' element={<NotFound/>}/>
                    <Route path="expenses" element={<Expenses/>}/>
                    <Route path="invoices" element={<Invoices/>}>
                        <Route index element={
                            <main style={{padding: "1rem"}}>
                                <p>Select an invoice</p>
                            </main>
                        }
                        />
                        <Route path=":invoiceId" element={<Invoice/>}/>
                    </Route>
                    <Route
                        path="*"
                        element={
                            <main style={{padding: "1rem"}}>
                                <p>There's nothing here!</p>
                            </main>
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
