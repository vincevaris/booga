import { Link } from 'react-router-dom';
import { RegisterForm } from './register-form';

export const Register = () => {
    return (
    <div className='register'>
        <h1>Register</h1>
        <RegisterForm />
        <p>Already have an account? <Link to="/login">Log In</Link></p>
    </div>
    );
}