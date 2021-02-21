import * as Yup from "yup";

const RegisterSchema = Yup.object().shape({
    name: Yup.string()
        .min(6, 'Username is too short ')
        .max(50, 'Username is too Long ')
        .required('Username is required'),
    password: Yup.string()
        .min(6, 'Password is too short'),
    passwordConfirmation: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
})

export default RegisterSchema;