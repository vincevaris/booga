import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserWithCache } from "../cache";
import { Post } from "../components/post";
import { Timeline } from "../components/timeline";
import { db } from "../config/firebase";
import { IPost, IUser } from "./home";

type UserProfileParams = {
    id: string,
}

export const UserProfile = () => {
    const { id } = useParams<UserProfileParams>();
    const [user, setUser] = useState<IUser | null>();

    const postsRef = collection(db, 'posts');
    const fetchUser = async () => {
        id && getUserWithCache(id)
            .then(async (result) => setUser(result))
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        fetchUser();
    }, [])

    return (
    <div className="user-profile">
        {!user ? (
            <p>Couldn't find a user with that ID.</p>
        ) : (
        <>
            <div className="user-profile_info">
                <div className="user-profile_displayName">
                    {user.displayName}
                </div>
                <div className="user-profile_id">
                    ID: {user.id}
                </div>
            </div>
            <div className="user-profile_content">
                <div className="user-profile_posts">
                    <Timeline query={query(postsRef, where('userId', '==', id), orderBy('createdAt', "desc"), limit(10))} />
                </div>
            </div>
        </>
        )}
    </div>
    );
};