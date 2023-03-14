import { addDoc, collection, deleteDoc, doc, DocumentReference, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { getUserWithCache } from "../cache";
import { auth, db } from "../config/firebase";
import { IPost, IUser } from "../pages/main";

interface Props {
    key: string,
    post: IPost,
}

interface ILike {
    // 1 = like, -1 = dislike, 0 = none
    value: number;
    userId: string;
}

const isValidUrl = (urlString: string) => {
    let url;
    try {
        url = new URL(urlString);
    } catch (error) {
        return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
}

export const Post = (props: Props) => {
    const { post } = props;

    const [author, setAuthor] = useState<IUser>();
    const [likes, setLikes] = useState<ILike[]>([]);
    
    const [self] = useAuthState(auth);
    const [selfLikeRef, setSelfLikeRef] = useState<DocumentReference>();
    
    const styledContent = post.content.split(' ')
            .map(s => {
                if (isValidUrl(s))
                    return <a href={s} rel="noreferrer" target="_blank">{s} </a>;
                return <span>{s} </span>
            });

    const likesRef = collection(db, 'likes');
   
    const fetchAuthor = async () => setAuthor(await getUserWithCache(post.userId));

    const fetchLikes = async () => {
        // Fetch likes/dislike documents for this
        const likesQuery = query(likesRef, where('postId', '==', post.id));
        const data = await getDocs(likesQuery);

        // Map like/dislike documents to interface and update stateful likes array
        setLikes(data.docs.map((doc) => ({ ...doc.data() } as ILike)));

        // If the user liked/disliked this post, update self like reference
        setSelfLikeRef(data.docs.find((doc) => doc.get('userId') === self?.uid)?.ref);
    };

    const likePost = async (value: number) => {
        const newLike = { value: value, userId: self?.uid, postId: post.id } as ILike;

        if (selfLikeRef) 
            await setDoc(selfLikeRef, newLike);
        else
            setSelfLikeRef(await addDoc(likesRef, newLike));

        setLikes((prev) => {
            const index = prev.findIndex((oldLike) => oldLike.userId === newLike.userId);

            if (index === -1) return [ ...prev, newLike ];

            prev[index] = newLike;

            return [...prev];
        });
    };

    const dislikePost = async () => likePost(-1);

    const removeLike = async () => {
        selfLikeRef && await deleteDoc(selfLikeRef);
        setLikes((prev) => [...prev.filter((like) => like.userId !== self?.uid)]);
        setSelfLikeRef(undefined);
    }

    const deletePost = async () => {
        const postsRef = collection(db, 'posts');
        await deleteDoc(doc(postsRef, post.id));
    };

    const getLikes = () => likes?.filter((like) => like.value === 1);
    const getDislikes = () => likes?.filter((like) => like.value === -1);

    const getSelfLike = () => likes?.find((like) => like.userId === self?.uid);

    const isSelfLiked = () => getSelfLike()?.value === 1;
    const isSelfDisliked = () => getSelfLike()?.value === -1;

    useEffect(() => {
        fetchAuthor();
        fetchLikes();
    }, []);

    return (
    <div className="post">
        <div className="post_displayName">
            <Link to={`/u/${author?.id}`}>{author?.displayName || 'Unknown user'}</Link>
        </div>
        <div className="post_content">
            {styledContent}
        </div>
        <div className="post_createdAt">
            {post.createdAt.toDate().toUTCString()}
        </div>
        <div className="post_controls">
            <div className="post_user-controls">
                <button
                className={isSelfLiked() ? 'toggle-on' : ''}
                onClick={() => self && (isSelfLiked() ? removeLike() : likePost(1))}>
                    &#128077; {getLikes().length}
                </button>
                <button 
                className={isSelfDisliked() ? 'toggle-on' : ''}
                onClick={() => self && (isSelfDisliked() ? removeLike() : likePost(-1))}>
                    &#128078; {getDislikes().length}
                </button>
            </div>
            {self?.uid === post.userId && (
            <div className="post_mod-controls">
                <button className="delete" onClick={deletePost}>Delete</button>
            </div>
            )}
        </div>
        {false && (<div className="post_replies"></div>)}
    </div>
    );
};