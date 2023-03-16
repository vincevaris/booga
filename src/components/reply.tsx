import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getUserWithCache } from "../cache";
import { auth } from "../config/firebase";
import { IPost, IUser } from "../pages/home";

interface Props {
    key: string,
    post: IPost,
}

export const Reply = (props: Props) => {
    const { post } = props;
    const [user, setUser] = useState<IUser | null>();
    const [ourUser] = useAuthState(auth);
    
    const fetchUser = async () => setUser(await getUserWithCache(post.userId));

    useEffect(() => { fetchUser() }, []);

    return (
    <div className="reply">
        <div className="reply_displayName">
            {user?.displayName || 'Deleted user'}
        </div>
        <div className="reply_content">
            {post.content}
        </div>
        <div className="reply_controls">
            {ourUser?.uid === post.userId && (
            <div className="mod-controls">
                <button className="delete">Delete</button>
            </div>
            )}
        </div>
    </div>
    );
};