import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom';
import io from 'socket.io-client'
import { useHistory } from 'react-router';
import messageSendIcon from '../images/message-send-icon.png'

export default function Dashboard() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([])
    const [messageCheck, setMessageCheck] = useState(false);
    const [user, setUser] = useState({});
    const [rooms, setRooms] = useState([]);
    const [selectedRoomDropdown, setSelectedRoomDropdown] = useState([]);
    const [userRoomsIds, setUserRoomsIds] = useState([]);
    const [currentRoom, setCurrentRoom] = useState({})
    const [currentRoomId, setCurrentRoomId] = useState(0)
    const [checkUser, setCheckUser] = useState(false);
    const messagesEndRef = useRef(null);

    let history = useHistory();

    const [socket] = useState(() => io(':8000')); //Notice how we dont give this a setSocket function. This is because we don't want it being ran everytime the component renders. These are also known as lazy useState hooks.

    //SOCKET.IO SETUP ----------------------
    useEffect(() => {
        //We need to set up all of our event listeners in the useEffect callback function
        socket.on("Welcome", data => console.log(data)); //Gets data from a trigger from the server

        //Note that we're returning a callback function. This ensures that the underlying socket will be closed if App is unmounted. This would be more critical if we were creating the socket in a subcomponent.
        return () => socket.disconnect(true);
    }, [socket]);

    useEffect(() => {
        let isMounted = true;
        socket.on("newMessage", data => {
            if (isMounted) {
                if (data.roomId === currentRoomId) {
                    console.log(data.roomId + " === " + currentRoomId)
                    setMessages([...messages, data]);
                }
            }
        })

        return () => { isMounted = false }
    }, [messages, currentRoomId, socket])


    //RETRIEVING LOGGED IN USER INFO ----------------------
    useEffect(() => {
        axios.post("http://localhost:8000/api/getloggedinuser", { localStorage: localStorage.getItem('userToken') })
            .then(response => {
                setUser(response.data)
                const roomIds = [];
                for (let i = 0; i < response.data.rooms.length; i++) {
                    roomIds.push(response.data.rooms[i]._id);
                }
                setUserRoomsIds(roomIds);
            })
            .catch(err => history.push('/login'));
    }, [checkUser, history])

    //RETRIEVING ALL ROOMS ----------------------
    useEffect(() => {
        axios.get("http://localhost:8000/api/rooms")
            .then(rooms => setRooms(rooms.data))
            .catch(err => console.log(err))
    }, [])

    //RETRIEVING SINGLE ROOM ----------------------
    useEffect(() => {
        let isMounted = true;
        axios.get(`http://localhost:8000/api/rooms/${currentRoomId}`)
            .then(room => {
                if (isMounted) {
                    setMessages(room.data.messages)
                }
                setCurrentRoom(room.data)
            })
            .catch(err => console.log(err))

        return () => { isMounted = false }

    }, [currentRoomId])

    //RETRIEVING SINGLE ROOM MESSAGES----------------------
    useEffect(() => {
        let isMounted = true;
        axios.get(`http://localhost:8000/api/rooms/${currentRoomId}`)
            .then(room => {
                if (isMounted) {
                    setMessages(room.data.messages)
                }
            })
            .catch(err => console.log(err))

        return () => { isMounted = false }
    }, [currentRoom, messageCheck, currentRoomId])

    //USER JOINS ROOM ----------------------
    //Take current users id, update their rooms array to have the room with the index of (whichever they clicked on)
    function handleJoin() {
        const _id = selectedRoomDropdown.slice(0, selectedRoomDropdown.indexOf(','))
        const name = selectedRoomDropdown.slice(selectedRoomDropdown.indexOf(',') + 1)
        const newObj = {
            _id: _id,
            name: name
        }
        if (typeof newObj._id !== 'object') {
            axios.post(`http://localhost:8000/api/users/addroom/${user._id}`, newObj)
                .then(response => {
                    setCheckUser(!checkUser);
                    setSelectedRoomDropdown([]);
                })
                .catch(err => console.log(err));
        }

    }

    //HANDLE SUBMIT (for message form) ----------------------
    function handleSubmit(e) {
        e.preventDefault();
        if (currentRoomId !== 0) {
            axios.post(`http://localhost:8000/api/rooms/message/${currentRoomId}`, { senderName: user.username, message: message, senderImage: user.imageUrl })
                .then(response => {
                    socket.emit("newMessage", { message: message, roomId: currentRoomId, senderName: user.username, senderImage: user.imageUrl })
                    setMessageCheck(!messageCheck);
                })
                .catch(err => console.log(err));
        }
        setMessage("");
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView(true);
    }, [messages])



    return (
        <>
            <div className=" vh-100 p-0 w-100 bg-dark bg-gradient text-light">


                <div className="show-mobile">
                    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">

                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        {
                            currentRoomId === 0 ?
                                <h2 style={{ justifySelf: "center !important" }}>ChatRoom</h2>
                                :
                                <h2>{currentRoom.name}</h2>
                        }
                        <div class="collapse navbar-collapse" id="navbarNav">
                            <ul class="navbar-nav">
                                <li class="nav-item active">
                                    <div className="container-fluid w-100 h-100 sidebar-container pt-3">
                                        <Link to="/account">
                                            <p><img style={{ display: 'inline', width: '50px', height: '50px', objectFit: 'cover', objectPosition: 'center top'}} src={user.imageUrl} alt="Profile IMG" className="rounded-circle" /></p>
                                        </Link>
                                        <div className="row d-flex justify-content-center align-items-center rooms-container" style={{ maxHeight: '100px !important' }}>
                                            <Link className="p-0" to="/createroom"><button className="btn w-75 mb-3 btn-success rounded-pill">Create a room</button></Link>
                                            <select onChange={e => setSelectedRoomDropdown(e.target.value)} className="form-select btn w-75 mb-3 btn-primary rounded-pill" aria-label="Default select example">
                                                <option defaultValue value={'blank'}>Join a room</option>
                                                {rooms.filter(room => !userRoomsIds.includes(room._id)).map((item, index) => {
                                                    return <option key={index} value={[item._id, item.name]} >{item.name}</option>
                                                })}
                                            </select>
                                            <button onClick={handleJoin} className="btn w-50 mb-3 btn-primary rounded-pill">Join</button>

                                            <h2>Rooms</h2>
                                            <ul className="list-group" id="room-list">
                                                {user.rooms ?
                                                    user.rooms.map((item, index) => {
                                                        return <li className="list-group-item btn list-group-hover bg-transparent border-0 text-light" key={index} onClick={() => setCurrentRoomId(item._id)} style={{ fontWeight: "bold" }}>{item.name}</li>
                                                    })
                                                    : null
                                                }
                                            </ul>

                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>

                <div className="row bg-dark h-100 m-0 ">
                    <div className="col-sm-3 h-100 bg-dark bg-gradient hide-mobile">
                        <div className="container-fluid w-100 h-100 sidebar-container">
                            <div className="row top-sidebar p-2 mb-5 align-items-center justify-content-start" style={{ maxHeight: '100% !important' }}>
                                <div className="col-xl-4 ">
                                    <Link to="/account">
                                        <p><img style={{ display: 'inline', width: '100px', height: '100px', objectFit: 'cover', objectPosition: 'center top' }} src={user.imageUrl} alt="Profile IMG" className="rounded-circle" /></p>
                                    </Link>
                                </div>
                                <div className="col-md-8 d-flex flex-column align-items-start user-names-container">
                                    <strong style={{ fontSize: "1.5rem" }}>{user.username}</strong>
                                    <span>{user.firstName + " " + user.lastName}</span>
                                </div>
                            </div>
                            <div className="row d-flex justify-content-center align-items-center rooms-container" style={{ maxHeight: '100px !important' }}>
                                <Link className="p-0" to="/createroom"><button className="btn w-75 mb-3 btn-success rounded-pill">Create a room</button></Link>
                                <select onChange={e => setSelectedRoomDropdown(e.target.value)} className="form-select btn w-75 mb-3 btn-primary rounded-pill" aria-label="Default select example">
                                    <option defaultValue value={'blank'}>Join a room</option>
                                    {rooms.filter(room => !userRoomsIds.includes(room._id)).map((item, index) => {
                                        return <option key={index} value={[item._id, item.name]} >{item.name}</option>
                                    })}
                                </select>
                                <button onClick={handleJoin} className="btn w-50 mb-3 btn-primary rounded-pill">Join</button>

                                <h2>Rooms</h2>
                                <ul className="list-group">
                                    {user.rooms ?
                                        user.rooms.map((item, index) => {
                                            return <li className="list-group-item btn list-group-hover bg-transparent border-0 text-light" key={index} onClick={() => setCurrentRoomId(item._id)} style={{ fontWeight: "bold" }}>{item.name}</li>
                                        })
                                        : null
                                    }
                                </ul>

                            </div>
                        </div>
                    </div>
                    <div className="col-sm-9 bg-dark h-100 pt-0">
                        <div className="row h-10">
                            <h1 className="border-bottom pb-2 chat-box-logo border-light">ChatRoom</h1>
                        </div>
                        <div className="row mt-3 hide-mobile">
                            {
                                currentRoomId === 0 ?
                                    <h2 className="border-bottom pb-2 border-light">Join a room to start chatting!</h2>
                                    :
                                    <h2 className="border-bottom pb-2 border-light">{currentRoom.name} xx</h2>
                            }
                        </div>
                        <div className="row mt-0 pb-0 message-container">
                            {
                                currentRoomId === 0 || !messages ?
                                    <h2 className="mb-5 pb-2 ">Chat Messages Will Go Here</h2>
                                    :
                                    messages.map((item, index) => {
                                        return (
                                            <div key={index}>
                                                <p style={{ textAlign: 'left' }} key={index}><img style={{ display: 'inline', width: '25px', height: '25px' }} src={item.senderImage} alt="Profile IMG" className="rounded-circle" /><strong>{item.senderName}:{"       "}</strong>{item.message}</p>
                                            </div>

                                        )
                                    })
                            }
                            <div ref={messagesEndRef} id="messagesEndRef" />
                        </div>
                        <div className="row p-3 message-box-container bg-gradient position-absolute bottom-0">
                            <form className="d-flex align-items-center justify-content-center" onSubmit={e => handleSubmit(e)}>
                                <input type="text" className="bg-gradient rounded-pill form-control p-1" id="message" placeholder="Send a message..." value={message} onChange={e => setMessage(e.target.value)} />
                                <button type="submit" className="bg-transparent ml-3" id="message-send-button"><img src={messageSendIcon} alt="" className="w-50 bg-transparent" /></button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
