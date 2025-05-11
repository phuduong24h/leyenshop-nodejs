import * as yup from 'yup';

export const signUpSchema = () =>
  yup.object().shape({
    fullName: yup.string().required('Full name is required'),
    phone: yup.string().required('Phone is required'),
    address: yup.string().required('Address is required'),
    password: yup.string().required('Password is required')
  });
