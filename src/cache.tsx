import { collection, doc, getDoc, getDocs, limit, orderBy, query, Timestamp } from "firebase/firestore";
import { db } from "./config/firebase";
import { IPost, IUser } from "./pages/main";

let userCache = new Map<string, IUser>();
let postCache = new Map<string, IPost>();

export const setUserCache = (cache: Map<string, IUser>) => {
    userCache = cache;
}

export const setPostCache = (cache: Map<string, IPost>) => {
    postCache = cache;
}

export const saveCacheSession = () =>
{
    console.log('Saving cache session to local storage')
    localStorage['user_cache'] = JSON.stringify(Array.from(userCache.values()));
    localStorage['post_cache'] = JSON.stringify(Array.from(postCache.values()));
}

export const getUserWithCache = async (id: string) => {
    console.log(`Fetching user id ${id} with regards to cache rules`)

    if (!userCache.has(id)) {
        const userCollectionRef = collection(db, 'users');
        const userRef = doc(userCollectionRef, id);

        console.log(`Creating document for user id ${id}`)
        const userSnap = await getDoc(userRef);
        const user = { ...userSnap.data(), id: userSnap.id, } as IUser;

        console.log(`Updating cache for user id ${id}`);
        userCache.set(user.id, user);
        saveCacheSession();
    } else
        console.log(`Using previous cache for user id ${id}`);

    return userCache.get(id);
}

export const getPostsWithCache = async () => {
    console.log('Fetching recent posts with regards to cache rules')

    if (postCache.size === 0)
       forceUpdatePosts();
    else
        console.log(`Using previous cache for recent posts`);

    return Array.from(postCache.values());
}

export const forceUpdatePosts = async () => {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('createdAt', "desc"), limit(10));

    console.log('Starting recent posts query (order by creation date, limit by 10)')
    const data = await getDocs(q);
    const posts = await Promise.all(data.docs.map(async (postSnap) => {
        return {
            ...postSnap.data(),
            id: postSnap.id,
        } as IPost;
    })) as IPost[];

    console.log('Updating cache for recent posts')
    postCache = new Map(posts.map(doc => [doc.id, doc]));
    saveCacheSession();
}