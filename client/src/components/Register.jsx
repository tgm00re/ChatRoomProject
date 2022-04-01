import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { useHistory } from 'react-router';


export default function Register() {

    const [firstName, setFirstName] = useState("");
    const [lastName,setLastName] = useState("");
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});

    let history = useHistory();


    useEffect(() =>{
        let isMounted = true;
        if(isMounted){
            const token = localStorage.getItem("userToken")
            if (token != null){
                history.push('/dashboard')
            }
        }
        return () => {isMounted = false};
    }, [])
    
    

    function handleSubmit(e){
        e.preventDefault();
        const newUser = {
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            password: password,
            confirmPassword: confirmPassword
        }
            axios.post('http://localhost:8000/api/users/register', newUser)
            .then(response => {
                localStorage.setItem( "userToken", response.data.token )
                history.push('/dashboard');
                setFirstName("");
                setLastName("");
                setUsername("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setErrors({});
            })
            .catch(err => {
                setErrors(err.response.data.errors);
            })
    }

    return (
        <>
            <div className="container-fluid vh-100 bg-dark bg-gradient">
                <div className="row h-100">
                    <div className="col-xl-4 py-5 bg-dark bg-gradient text-light d-flex flex-column align-items-center justify-content-center">
                        <h1 className="display-2 pb-3 w-75"><strong>Already Have An Account?</strong></h1>
                        <form className="w-50">  {/* Form used to keep styling between sign in and sign up button the same. */}
                        <Link to="/login" style={{color: "white", textDecoration: "none"}}><button className="btn btn-primary mt-4 rounded-pill p-3 login-button"><strong>Sign In</strong></button></Link>
                        </form>
                    </div>
                    <div className="col-xl-8 bg-primary bg-gradient text-light">
                        <div className="py-5 h-100 d-flex flex-column align-items-center justify-content-center">
                            <h1>Welcome To ChatRoom</h1>
                            <h1 className="display-2 border-bottom border-light pb-5 w-75"><strong>Register</strong></h1>
                                <form className="w-50" onSubmit={handleSubmit}>
                                    <div className="form-group my-3">
                                        <input type="text" className="rounded-pill form-control p-3 login-text" id="firstName" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)}/>
                                        {errors.firstName ? 
                                        <p className="text-warning" style={{fontWeight: "bold"}}>{errors.firstName.message}</p>
                                        :
                                        null}
                                    </div>
                                    <div className="form-group my-3">
                                        <input type="text" className="rounded-pill form-control p-3 login-text" id="lastName" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)}/>
                                        {errors.lastName ? 
                                        <p className="text-warning" style={{fontWeight: "bold"}}>{errors.lastName.message}</p>
                                        : null}
                                    </div>
                                    <div className="form-group my-3">
                                        <span>Username must be between 4-15 characters</span>
                                        <input type="text" className="rounded-pill form-control p-3 login-text" id="username" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}/>
                                        {errors.username ?
                                        <p className="text-warning" style={{fontWeight: "bold"}}>{errors.username.message}</p>
                                        : null}
                                    </div>
                                    <div className="form-group my-3">
                                        <input type="email" className="rounded-pill form-control p-3 login-text" id="email" aria-describedby="emailHelp" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                                        {typeof errors.email !== 'undefined'? 
                                        <p className="text-warning" style={{fontWeight: "bold"}}>{errors.email.message}</p>
                                        : null}
                                    </div>
                                            
                                    <div className="form-group my-4">
                                        <span>Password must be between 6-25 characters</span>
                                        <input type="password" className="rounded-pill form-control p-3 login-text" id="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
                                        {errors.password ? 
                                        <p className="text-warning" style={{fontWeight: "bold"}}>{errors.password.message}</p>
                                        : null}
                                    </div>
                                    <div className="form-group my-4">
                                        <input type="password" className="rounded-pill form-control p-3 login-text" id="confirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}/>
                                        {errors.confirmPassword ? 
                                        <p className="text-warning" style={{fontWeight: "bold"}}>{errors.confirmPassword.message}</p>
                                        : null}
                                    </div>
                                    <button type="submit" className="btn btn-dark bg-gradient rounded-pill p-3 login-button"><strong>Register</strong></button>
                                </form>
                        </div>
                    </div>

                </div>
            </div>

    </>
    )
}
