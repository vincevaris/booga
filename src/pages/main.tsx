import { Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { forceUpdatePosts, getPostsWithCache } from '../cache';
import { Post } from '../components/post';

export interface IUser {
    id: string;
    displayName: string;
}

export interface IPost {
    id: string;
    userId: string;
    content: string;
    createdAt: Timestamp;
}

export const Main = () => {
    const [postsList, setPostsList] = useState<IPost[] | null>();
    const [disabled, setDisabled] = useState(false);
    
    const onRefresh = async () => {
        setDisabled(true);
        await forceUpdatePosts();
        getPosts();
        setTimeout(() => setDisabled(false), 1000);
    };
    
    const getPosts = async () => setPostsList(await getPostsWithCache());

    useEffect(() => { getPosts() }, []);

    return (
    <div className='main'>
        <button className='refresh' onClick={onRefresh} disabled={disabled}>Refresh</button>
        <div className='posts'>
            {postsList?.map((post) => <Post key={post.id} post={post}/>)}
        </div>
    </div>
    );
}