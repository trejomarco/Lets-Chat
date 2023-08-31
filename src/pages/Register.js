import React, { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc, Timestamp} from "firebase/firestore"
import { useNavigate } from "react-router-dom"

const Register = () => {
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        error: null,
        loading: false,
    });

    const history = useNavigate()
    const {name, email, password, error, loading} = data;

    const handleChange = (e) => {
        setData({...data, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // before make request to firebase
        setData({...data, error: null, loading: true });

        // check if all fields are filled
        if (!name || !email || !password) {
            setData({...data, error: "All fields are required!"})
        };
        // create new user from imported auth 
        try {
            const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            // sets user info in firestore
          await setDoc(doc(db, 'users', result.user.uid), {
              uid: result.user.uid,
              name,
              email, 
              createdAt: Timestamp.fromDate(new Date()),
              isOnline: true,
          });
          
        //   resets the state
          setData({name: "", email: "", password: "", error:null, loading:false});
          history("/", {replace: true});
        } catch (err) {
            let errorCode = error.code;
            if (errorCode === 'auth/invalid-email') {
                setData({ ...data, error: err.message, loading: false})
            }
            
        }
    };

    return (
   <section>
       <h3>Create An Account</h3>
       <form className="form" onSubmit={handleSubmit}>
           <div className="input_container">
               <label htmlFor="name">Name</label>
               <input type="text" name="name" value={name} onChange={handleChange}/>
           </div>
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
               <button className="btn" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
           </div>
       </form>
   </section>
    )
}

export default Register
