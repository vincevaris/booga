import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { auth } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';

interface LoginFormData {
    email: string;
    password: string;
}

export const LoginForm = () => {
    const navigate = useNavigate();

    const schema = yup.object().shape({
        email: yup.string().email().required('No email address entered.'),
        password: yup.string().required(),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: yupResolver(schema),
    });

    const [disabled, setDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onLogin = async (data: LoginFormData) => {
        setDisabled(true);
        signInWithEmailAndPassword(auth, data.email, data.password)
            .then((result) => navigate('/'))
            .catch((error) => {
                setErrorMessage(error.message)
                setDisabled(false);
            });
    };

    return (
    <form onSubmit={handleSubmit(onLogin)}>
        <input type="email" placeholder="Email..." {...register("email")} />
        <input type="password" placeholder="Password..." {...register("password")} />
        <input type="submit" value="Log In" disabled={disabled}/>
        {errorMessage && (
            <p className="error">{errorMessage}</p>
        )}
    </form>
    );
};