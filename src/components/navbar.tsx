import { Link } from "react-router-dom";
import { auth } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from "firebase/auth";
import logo from '../assets/logo_white_500-120.png';
import { getUserWithCache } from "../cache";
import { useEffect, useState } from "react";
import { IUser } from "../pages/home";

export const Navbar = () => {
    const [user] = useAuthState(auth);

    const [userData, setUserData] = useState<IUser>();

    const signUserOut = async () => {
        await signOut(auth);
    };

    useEffect(() => {
        console.log('Change in user, set new user data')
        if (user)
            getUserWithCache(user.uid).then((result) => setUserData(result));
        else
            setUserData(undefined);
    }, [user]);

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
                        {userData && (
                            <div className="currentUser">
                                Logged in as <Link to={`/u/${userData.id}`}><strong>{userData.displayName}</strong></Link>
                            </div>
                        )}
                        <button onClick={signUserOut}>Log Out</button>
                    </>
                )}
            </div>
        </div>
    );
}