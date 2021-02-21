import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
    name: Yup.string()
            .min(6,"Username is too short")
            .max(50, "Username is too long")
            .required('Username is required'),
    password: Yup.string()
            .min(6, "Password is too short")
            .max(50, "Password is too long")
})

export default LoginSchema