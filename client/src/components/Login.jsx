import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    let history = useHistory();

    useEffect(() =>{
        let isMounted = true;
        if(isMounted){
            const token = localStorage.getItem("userToken")
            console.log(token);
            if (token != null){
                history.push('/dashboard')
            }
        }
        return () => {isMounted = false};
    }, [history])
    
    function handleSubmit(e){
        e.preventDefault();
        axios.post('http://localhost:8000/api/login', {email: email, password: password})
            .then(response => {
                localStorage.setItem( "userToken", response.data.token )
                history.push("/dashboard");
                setEmail("");
                setPassword("");
            })
            .catch(err => {
                setError(err.response.data);
            });
    }


    return (
    <>
            <div className="container-fluid vh-100 bg-dark bg-gradient">
                
                <div className="row h-100">
                    <div className="col-xl-8 bg-dark bg-gradient text-light">
                        <div className="py-5 h-100 d-flex flex-column align-items-center justify-content-center">
                            <h1>CHATROOM</h1>
                            <h1 className="display-2 border-bottom border-light pb-5 w-75"><strong>Login to Your Account</strong></h1>
                                <form className="w-50" onSubmit={handleSubmit}>
                                {error !== "" ?
                                <p className="text-warning h3" style={{fontWeight: "bold"}}>{error}</p>
                                : null}
                                <div className="form-group my-3">
                                    <input type="text" className="rounded-pill form-control p-3 login-text" id="email" aria-describedby="emailHelp" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                                </div>
                                <div className="form-group my-4">
                                    <input type="password" className="rounded-pill form-control p-3 login-text" id="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
                                </div>
                                <button type="submit" className="btn btn-primary bg-gradient rounded-pill p-3 login-button"><strong>Sign In</strong></button>
                                </form>
                        </div>
                    </div>
                    <div className="col-xl-4 py-5 bg-primary bg-gradient text-light d-flex flex-column align-items-center justify-content-center">
                        <h1 className="display-2 pb-3 w-75"><strong>New Here?</strong></h1>
                        <span id="sign-up-description" className="font-weight-bold">Sign up to start chatting today!</span>
                        <form className="w-50">  {/* Form used to keep styling between sign in and sign up button the same. */}
                            <Link to="/register" style={{color: "white", textDecoration: "none"}}><button type="submit" className="btn btn-dark mt-4 rounded-pill p-3 login-button"><strong>Sign Up</strong></button></Link>
                        </form>
                    </div>
                </div>
            </div>

    </>
    )
}
