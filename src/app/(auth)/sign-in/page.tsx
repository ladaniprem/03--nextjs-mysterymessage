import {useForm} from "react-hook-form"
import { z } from "zod"
import axios, { AxiosError } from 'axios'
import { useState,useEffect} from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import { Toaster } from "@/components/ui/sonner"

const Page = () => {
  const [username,setUsername] =  useState('');
  const [usernameMessage,setUsernameMessage] = useState('')
  const [isCheckingUsername,setCheckingUsername] = useState(false);
  const [isSubmitting,setIsSubmitting] = useState(false);

  const debounceUsername = useDebounceValue(username,300)
   const {toast} = useToast()
  const router = useRouter();

   // zod Implementation

   const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues:{
     username : '',
     email : '',
     password: '', 
    }
   })

   useEffect(() => {
    const checkUsernameUnique = async() => {
     if(debounceUsername){
      setCheckingUsername(true)
      setUsernameMessage('')
     } 
     try {
      const response = await axios.get(`/api/check-username-unique?username=${debounceUsername}`)
      setUsernameMessage(response.data.message)
     } catch (error) {
      const axiosError  = error as AxiosError<ApiResponse>;
      setUsernameMessage(
        axiosError.response?.data.message ?? "Error checking Username"
      )
     }
     finally{
      setCheckingUsername(false)
     }
    }
    checkUsernameUnique();
   }, [debounceUsername]);

   const onSubmit = async (data:z.infer< typeof signUpSchema>) => {
    try {
      setIsSubmitting(true);
      try{
      const response = await axios.post<ApiResponse>('/api/sign-in', data);
      toast({
        title: "Success",
        description: response.data.message
      });
      router.replace(`verify/${username}`)
      setIsSubmitting(false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message
      toast({
        title: "signup failed",
        description: axiosError.response?.data.message ?? "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
   }
  }
  return (
    <div>
      <Toaster />
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <input 
            {...form.register('username')}
            onChange={(e) => setUsername(e.target.value)}
          />
          {usernameMessage && <p>{usernameMessage}</p>}
          {isCheckingUsername && <p>Checking username...</p>}
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}

export default Page