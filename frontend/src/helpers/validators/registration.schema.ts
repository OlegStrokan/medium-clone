import * as yup from 'yup'

export const registrationSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    userName: yup.string().required('Username is required'),
    fullName: yup.string().required('Full name is required'),
    password: yup.string().required('Password is required'),
})
