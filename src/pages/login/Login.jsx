import { useContext, useState } from "react"
import {signInWithEmailAndPassword } from "firebase/auth";
import{auth} from "../../firebase"
import "./login.scss"
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [error,setError] = useState(false);
  const [success,setSuccess] = useState(false);
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const navigate = useNavigate()

  const {dispatch} = useContext(AuthContext)

  const handleLogin = (e) =>{
    e.preventDefault()
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    dispatch({type:"LOGIN",payload:user})
    setSuccess(true);
    navigate("/");
  })
  .catch((error) => {
    setError(true);
  });
  };
  return (
    <div className="login">
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="email" onChange={e => setEmail(e.target.value)}/>
        <input type="password" placeholder="password" onChange={e => setPassword(e.target.value)}/>
        <button type="submit">Login</button>
        {error && <span>Wrong Email or Password..!</span>}
        {success && <span className="success">You Are Loged In Successfully..!</span>}
      </form>
    </div>
  );
};

export default Login