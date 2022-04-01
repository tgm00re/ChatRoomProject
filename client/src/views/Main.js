import React from 'react'
import Login from '../components/Login'
import {BrowserRouter, Route, Redirect} from 'react-router-dom'
import Register from '../components/Register'
import Dashboard from '../components/Dashboard'
import Account from '../components/Account'
import CreateRoom from '../components/CreateRoom'

export default function Main() {
    return (
        <>
            <BrowserRouter>
                <Route exact path="/login">
                    <Login/>
                </Route>
                <Route exact path="/register">
                    <Register/>
                </Route>
                <Route exact path ="/dashboard">
                    <Dashboard/>
                </Route>
                <Route exact path ="/account">
                    <Account/>
                </Route>
                <Route exact path ="/createroom">
                    <CreateRoom/>
                </Route>
                <Route exact path="/">
                    <Redirect to="/login" />
                </Route>
            </BrowserRouter>
        </>
    )
}
