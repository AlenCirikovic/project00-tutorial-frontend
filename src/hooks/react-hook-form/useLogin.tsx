import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

export interface LoginUserFields {
  email: string
  password: string
}

export const useLoginForm = () => {
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email().required('Please enter a valid email'),
    password: Yup.string(),
  })
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(LoginSchema),
  })

  return {
    handleSubmit,
    errors,
    reset,
    control,
  }
}

export type LoginForm = ReturnType<typeof useLoginForm>
