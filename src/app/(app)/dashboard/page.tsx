'use client'
import { useCallback, useEffect } from 'react'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { AxiosError} from 'axios'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Loader2, RefreshCcw } from 'lucide-react'
import MessageCard from '@/components/MessageCard'
import { useSession } from 'next-auth/react'

interface Message {
  _id: string;
  content: string;
  // Add other message properties as needed
}

const Page = () => {
  const { data: session } = useSession()
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [acceptMessages] = useState(false)

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const {setValue} = form;
  const username = session?.user?.username
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success('Link copied to clipboard')
  }

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])
      if (refresh) {
        toast.success("Messages refreshed successfully")
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data?.message || "Failed to fetch messages")
    } 
    finally {
      setIsLoading(false)
    }
  }, [])

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-message')
      setValue('acceptMessage', response.data.isAccesptingMessage ?? false)
    } 
    catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to fetch message setting")
      }
    } 
    finally {
      setIsSwitchLoading(false)
    }
  },[setValue])

  useEffect(() => {
    if(!session || !sessionStorage.user) return 
    fetchAcceptMessage()
    fetchMessages()
  }, [fetchAcceptMessage, fetchMessages, session])

  //handle switch change 
  const handleSwitchChange = async() => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages',{
        acceptMessages : !acceptMessages
      })
      setValue('acceptMessage',!acceptMessages)
      toast(response.data.message)
    } 
    catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to update message settings")
      }
    }
  }
  return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
      <h1 className='text-4xl font-bold mb-4'>User Dashboard</h1>
      <div className='mb-4'>
        <h2 className='text-lg font-semibold'>Copy Your unique Link</h2>
        <div className='flex items-center'>
          <input type='text' value={profileUrl} disabled className='input input-bordered w-full p-2 mr-2'/>
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>
      <div className='mb-4'>
        <Switch
          {...form.register('acceptMessage')}
          checked={form.watch('acceptMessage')}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className='ml-2'>Accept Message: {form.watch('acceptMessage') ? 'On' : 'Off'}</span>
      </div>
      <Separator/>
      <Button 
        className='mt-4' 
        variant='outline' 
        onClick={() => fetchMessages(true)} 
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className='h-4 w-4 animate-spin'/>
        ) : (
          <RefreshCcw className='h-4 w-4'/>
        )}
      </Button>
      <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard key={index} message={message} onMessageDelete={handleSwitchChange}/>
          ))
        ) : (
          <p>No message to display.</p>
        )}
      </div>
    </div>
  )
}

export default Page;