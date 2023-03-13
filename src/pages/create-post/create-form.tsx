import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { forceUpdatePosts } from '../../cache';

interface CreatePostFormData {
    content: string;
}

export const CreatePostForm = () => {
    const [ user ] = useAuthState(auth);
    const navigate = useNavigate();

    const schema = yup.object().shape({
        content: yup.string().required('A post requires content.').max(280, 'A post can only be up to 280 characters.'),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreatePostFormData>({
        resolver: yupResolver(schema),
    });

    const postsRef = collection(db, 'posts');

    const [disabled, setDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onCreatePost = async (data: CreatePostFormData) => {
        setDisabled(true);

        return addDoc(postsRef, {
            ...data,
            userId: user?.uid,
            createdAt: serverTimestamp()
        }).then(async (result) => {
            await forceUpdatePosts();
            navigate('/');
        }).catch((error) => {
            setErrorMessage(error.message);
            setDisabled(false);
        });
    };

    return (
    <form onSubmit={handleSubmit(onCreatePost)}>
        <textarea placeholder="What's on your mind?" {...register("content")} />
        <input type="submit" value="Post" disabled={disabled} />
        {errorMessage && (
            <p className="error">{errorMessage}</p>
        )}
    </form>
    );
};