'use client'
import React, { useCallback } from 'react'
import { Message } from '@/model/User.model'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import axios from 'axios'

function page() {
  const[message,setMessage] = useState<Message[]>([])
  const [isLoading,setLoading] = useState(false)
  const [isSwichLoading,setIsSwitchLoading] = useState(false)
  const {toast} = useToast()

  const handledDeleteMessage = (messageId:string) => {{
    setMessage(message.filter((message) => message._id!== messageId))

  }}
  const {data:session} = useSession()

  const form = useForm({
    reslover:zodResolver(acceptMessageSchema)
  })

  const {register,watch,setValue} = form;

  const acceptMessage = watch('acceptMessages')

  constt fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      await axios.get('/api/accept-message')
    } catch (error) {
      
    }
  },[setValue])
  return (
    <div>
      Dashboard
    </div>
  )
}

export default page
