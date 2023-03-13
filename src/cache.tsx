import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "./config/firebase";
import { IUser } from "./pages/main";

let userCache = new Map<string, IUser>();

export const setUserCache = (cache: Map<string, IUser>) => {
    userCache = cache;
}

export const saveCacheSession = () =>
{
    console.log('Saving cache session to local storage')
    localStorage['user_cache'] = JSON.stringify(Array.from(userCache.values()));
}

export const getUserWithCache = async (id: string) => {
    console.log(`Fetching user id ${id} with regards to cache rules`)

    if (!userCache.has(id)) {
        const userCollectionRef = collection(db, 'users');
        const userRef = doc(userCollectionRef, id);

        console.log(`Creating cached document for user id ${id}`)
        await getDoc(userRef)
            .then((result) => {
                if (result.exists()) {
                    const user = { ...result.data(), id: result.id, } as IUser;

                    console.log(`Updating cache for user id ${id}`);
                    userCache.set(user.id, user);
                    saveCacheSession();
                }
            })
            .catch((error) => console.log(error));
        
    } else
        console.log(`Using previous cache for user id ${id}`);

    return userCache.get(id);
}