import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import * as yup from 'yup';
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface ComposeFormData {
    content: string;
}

export const ComposeBox = () => {
    const [ user ] = useAuthState(auth);
    const navigate = useNavigate();

    const schema = yup.object().shape({
        content: yup.string().required('A post requires content.').max(280, 'A post can only be up to 280 characters.'),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ComposeFormData>({
        resolver: yupResolver(schema),
    });

    const postsRef = collection(db, 'posts');

    const [disabled, setDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onCreatePost = async (data: ComposeFormData) => {
        setDisabled(true);

        return addDoc(postsRef, {
            ...data,
            userId: user?.uid,
            createdAt: serverTimestamp(),
        }).then(async (result) => {

        }).catch((error) => {
            setErrorMessage(error.message);
        }).finally(() => setTimeout(() => setDisabled(false), 1_000));
    };

    return (
        <form className='composeBox' onSubmit={handleSubmit(onCreatePost)}>
            <textarea className='composeBox-content' placeholder="What's on your mind?" {...register("content")} />
            <input type="submit" value="Post" disabled={disabled} />
            {errorMessage && (
                <p className="error">{errorMessage}</p>
            )}
        </form>
    );
}