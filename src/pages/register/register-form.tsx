import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { collection, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';

interface RegisterFormData {
    email: string;
    password: string;
    displayName: string;
}

export const RegisterForm = () => {
    const navigate = useNavigate();

    const schema = yup.object().shape({
        email: yup.string().email().required('No email address entered.'),
        password: yup.string().min(1, 'A password must be at least 1 character long.').max(50, 'A password must be at most 50 characters long.'),
        displayName: yup.string().min(1, 'A display name must be at least 1 character long.').max(50, 'A display name must be at most 50 characters long.'),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: yupResolver(schema),
    });

    const usersRef = collection(db, 'users');

    const [disabled, setDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onRegister = async (data: RegisterFormData) => {
        setDisabled(true);
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then(async (result) => {
                const userRef = doc(usersRef, result.user.uid);
                await setDoc(userRef, {
                    displayName: data.displayName,
                });

                navigate('/');
            })
            .catch((error) => {
                setErrorMessage(error.message);
                setDisabled(false);
            });
    };

    return (
    <form onSubmit={handleSubmit(onRegister)}>
        <input type="email" placeholder="Email..." {...register("email")} />
        <input type="password" placeholder="Password..." {...register("password")} />
        <input placeholder="Display name..." {...register("displayName")} />
        <input type="submit" value="Register" disabled={disabled}/>
        {errorMessage && (
            <p className="error">{errorMessage}</p>
        )}
    </form>
    );
};