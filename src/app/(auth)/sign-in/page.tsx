import {useForm} from "react-hook-form"
import { z } from "zod"
import axios, { AxiosError } from 'axios'
import Link from "next/link"
import { useState,useEffect} from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useRouter } from "next/router"
import { signUpSchema } from "@/schemas/signUpSchema"
import { message } from '../../../model/User.model';
import { ApiResponse } from "@/types/ApiResponse"
function page() {
  const [username,setUsername] =  useState('');
  const [usenameMessage,setUsernameMessage] = useState('')
  const [useCheckingUsername,setCheckingUsername] = useState(false);
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
    const response = await axios.get(`/get/check-username-unique?username=${debounceUsername}`)
    setUsernameMessage(response.data.message)
     } catch (error) {
      const axiosError  = error as AxiosError<ApiResponse>;
      setCheckingUsername(
        axiosError.response?.data.message ?? "Error checking Username"
      )
     }
     finally{
      setCheckingUsername(false)
     }
    }
   },[debounceUsername])

   const onSubmit = async (data:z.infer< typeof signUpSchema>) => {
    
    setIsSubmitting(true)
    try{

    }
    catch{
       
    }
   }



  return (
    <div>
      page
    </div>
  )
}

export default page