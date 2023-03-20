import { Link } from "react-router-dom";
import { auth } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from "firebase/auth";
import logo from '../assets/logo_white_500-120.png';

export const Navbar = () => {
    const [user] = useAuthState(auth);

    const signUserOut = async () => {
        await signOut(auth);
    }

    return (
    <div className="navbar">
        <div className="links">
            <Link className="logo" to="/"><img src={logo} width='140vmin' alt='logo' /></Link>
          
        </div>
        <div className="user">
            {!user ? (
            <>
                <Link to="/login"><button>Log In</button></Link>
                <Link to="/register"><button>Register</button></Link>
            </>
            ) : (
            <>
                <button onClick={signUserOut}>Log Out</button>
            </>
            )}
        </div>
    </div>
    );
}