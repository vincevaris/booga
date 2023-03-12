import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserWithCache } from "../cache";
import { Post } from "../components/post";
import { db } from "../config/firebase";
import { IPost, IUser } from "./main";

type UserProfileParams = {
    id: string,
}

export const UserProfile = () => {
    const { id } = useParams<UserProfileParams>();
    const [user, setUser] = useState<IUser | null>();
    const [posts, setPosts] = useState<IPost[] | null>();
    const [disabled, setDisabled] = useState(false);

    const onRefresh = async () => {
        setDisabled(true);
        await fetchUser();
        setTimeout(() => setDisabled(false), 1000);
    };

    const fetchUser = async () => {
        id && getUserWithCache(id)
            .then(async (result) => {
                setUser(result);

                const postsRef = collection(db, 'posts');
                const q = query(postsRef, where('userId', '==', id), orderBy('createdAt', "desc"), limit(10));

                const data = await getDocs(q);
                setPosts(await Promise.all(data.docs.map(async (postSnap) => {
                    return {
                        ...postSnap.data(),
                        id: postSnap.id,
                    } as IPost;
                })) as IPost[]);
            })
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
                <button className='user-profile_refresh' onClick={onRefresh} disabled={disabled}>
                    Refresh
                </button>
            </div>
            <div className="user-profile_content">
                <div className="user-profile_posts">
                    {posts?.map((post) => <Post key={post.id} post={post}/>)}
                </div>
            </div>
        </>
        )}
    </div>
    );
};