import React, { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { updateDoc, doc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"

const Login = () => {
  
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        error: null,
        loading: false,
    });

    const navigate = useNavigate()
    const {email, password, error, loading} = data;

    const handleChange = (e) => {
        setData({...data, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // before make request to firebase
        setData({...data, error: null, loading: true })

        // check if all fields are filled
        if (!email || !password) {
            setData({...data, error: "All fields are required!"})
        }
        // create new user from imported auth 
        try {
            const result = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            // updates user info
          await updateDoc(doc(db, 'users',result.user.uid), {
              isOnline: true,
          });
        //   resets the state
          setData({email: '', password: '', error:null, loading:false});
          navigate("/", {replace: true});
        } catch (err) {
            let errorCode = error.code;
            if (errorCode === 'auth/invalid-email') {
            setData({ ...data, error: err.message, loading: false})
        }
    }
    };

    return (
   <section>
       <h3>Log Into Your Account</h3>
       <form className="form" onSubmit={handleSubmit}>
           <div className="input_container">
               <label htmlFor="name">Email</label>
               <input type="text" name="email" value={email} onChange={handleChange}/>
           </div>
           <div className="input_container">
               <label htmlFor="name">Password</label>
               <input type="password" name="password" value={password} onChange={handleChange}/>
           </div>
           {error ? <p className="error">{error}</p> : null}
           <div className="btn_container">
               <button className="btn" disabled={loading}>{loading ? 'Logging in...' : 'Login'} </button>
           </div>
       </form>
   </section>
    )
}

export default Login
