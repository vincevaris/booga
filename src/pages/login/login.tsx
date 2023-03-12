import { Link } from 'react-router-dom';
import { LoginForm } from './login-form';

export const Login = () => {
    return (
    <div className='login'>
        <h1>Log In</h1>
        <LoginForm />
        <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
    );
}