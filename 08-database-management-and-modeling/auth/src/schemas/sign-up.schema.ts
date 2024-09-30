import * as yup from 'yup';

export const signUpSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup
    .string()
    .min(8, 'Password at least have 8 characters')
    .required(),
});
