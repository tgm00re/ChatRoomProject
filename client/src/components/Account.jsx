import React, { useEffect, useState } from 'react'
import icon from '../images/home-icon.png'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { useHistory } from 'react-router';


export default function Account() {
    const [userId, setUserId] = useState(0);
    const [email,setEmail] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [error, setError] = useState("");
    const [imageError, setImageError] = useState("");
    const [originalEmail, setOriginalEmail] = useState("");

    let history = useHistory();

    function validateEmail(email) {
        var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(email)
    };
    

    useEffect(() => {
        axios.post("http://localhost:8000/api/getloggedinuser", {localStorage: localStorage.getItem('userToken')})
            .then(response => {
                setUserId(response.data._id);
                setEmail(response.data.email)
                setOriginalEmail(response.data.email);
                setImageUrl(response.data.imageUrl)
            })
            .catch(err => history.push('/login'));
    }, []);

    function handleSubmit(e){ 
        e.preventDefault();

        const newUser = {
            email: email,
            imageUrl: imageUrl
        }

        if(newUser.imageUrl === ''){
            newUser.imageUrl = "data:image/jpeg;base64,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"
            
        }
            
        if(!validateEmail(email)){
            setError("Invalid Email!")
        } else {
        axios.get(`http://localhost:8000/api/users/getbyemail/${email}`)
            .then(response => {
                if(response.data === null || email === originalEmail){ //Email does not exist already
                    axios.patch(`http://localhost:8000/api/users/update/${userId}`, newUser)
                        .then(updatedUser =>{
                            history.push("/dashboard")
                        })
                        .catch(err => {
                            setImageError("File is too large!")
                        });
                } else{
                    setError("Email Already Exists!")
                }
            })
        }
    }


    function logout(){
        localStorage.clear();
        history.push("/login");
    }


    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = (() => {
                resolve(fileReader.result)
            });

            fileReader.onerror = ((error) => {
                reject(error);
                setImageError("File is too large!")
            })
            
        })
    }

    const uploadImage = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertBase64(file);
        setImageUrl(base64);
    }


    return (
        <>
            <div className="container-fluid vh-100 bg-dark bg-gradient">
                <Link to="/dashboard"><img alt="home icon" src={icon} style={{position: 'absolute', top: '10px', left: '10px', width: '75px', zIndex: "2"}} id="home-button"/></Link>
                <button onClick={logout} className="btn btn-danger bg-gradient rounded-pill p-2 login-button" style={{position: 'absolute', top: '10px', right: '10px', width: '50px', zIndex: "2"}} id="logout-button"><strong>Logout</strong></button>
                
                <div className="row h-100">
                    <div className="col-xl-12 bg-dark bg-gradient text-light">
                        <div className="py-5 h-100 d-flex flex-column align-items-center justify-content-center">
                            <h1>CHATROOM</h1>
                            <h1 className="display-2 border-bottom border-light pb-5 w-75"><strong>Update Your Account</strong></h1>
                                <form className="w-50" onSubmit={handleSubmit}>
                                {
                                    error ? <p className="text-warning h3" style={{fontWeight: "bold"}}>{error}</p>
                                    : null
                                }
                                <div className="form-group my-3">
                                    <label htmlFor="email">Email</label>
                                    <input type="text" className="rounded-pill form-control p-3 login-text" id="email" aria-describedby="emailHelp" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                                </div>
                                <div className="form-group my-4">
                                {
                                    imageError ? <p className="text-warning h3" style={{fontWeight: "bold"}}>{imageError}</p>
                                    : null
                                }
                                    <label htmlFor="imageUrl">Image URL</label><br/>
                                    <input type="file"  onChange={(e) => uploadImage(e)}/>
                                    {/* <input type="text" className="rounded-pill form-control p-3 login-text" id="imageUrl" placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)}/> */}
                                </div>
                                <button type="submit" className="btn btn-primary bg-gradient rounded-pill p-3 login-button"><strong>Update Account</strong></button>
                                </form>
                        </div>
                    </div>
                </div>
            </div>

    </>
    )
}
