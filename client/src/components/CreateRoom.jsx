import React, {useState} from 'react'
import icon from '../images/home-icon.png'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useHistory } from 'react-router';

export default function CreateRoom() {
    const [name, setName] = useState("");
    const [error, setError] = useState("")

    let history = useHistory();


    function handleSubmit(e){
        e.preventDefault();
        axios.post('http://localhost:8000/api/rooms/create', {name: name})
            .then(response => {
                history.push('/dashboard');
            })
            .catch(err => setError(err.response.data.errors.name.message));
        setName("");
    }


    return (
        <>
            <div className="container-fluid vh-100 bg-dark bg-gradient">
                
                <Link to="/dashboard"><img alt="home icon" src={icon} style={{position: 'absolute', top: '0', left: '0', width: '75px'}}/></Link>
                
                <div className="row h-100">
                    <div className="col-xl-12 bg-dark bg-gradient text-light">
                        <div className="py-5 h-100 d-flex flex-column align-items-center justify-content-center">
                            <h1>CHATROOM</h1>
                            <h1 className="display-2 border-bottom border-light pb-5 w-75"><strong>Create A Room</strong></h1>
                                <form className="w-50" onSubmit={e => handleSubmit(e)}>
                                {
                                    error ? <p className="text-warning h3" style={{fontWeight: "bold"}}>{error}</p>
                                    : null
                                }
                                <div className="form-group my-3">
                                    <input type="text" className="rounded-pill form-control p-3 login-text" id="name" placeholder="Room Name" value={name} onChange={e => setName(e.target.value)}/>
                                </div>
                                <button type="submit" className="btn btn-success bg-gradient rounded-pill p-3 login-button"><strong>Create Room</strong></button>
                                </form>
                        </div>
                    </div>
                </div>
            </div>

    </>
    )
}
