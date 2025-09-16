'use client'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import React from 'react'
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { toast } from 'sonner';
import axios from "axios"
type Message = {
  _id: string;
  content: string;
}

type ApiResponse = {
  message: string;
}

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void
}

const MessageCard = ({message,onMessageDelete}:MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
    toast(response.data.message)
    onMessageDelete(message._id)
  }
  // some error in this code their error in the toast and the message error to reslove it to use it the differnt type to defined it the more effecetily management it 

// type MessageCardProps = {
//   message: Message; // MessageCardProps
//    _id: string; // type Message 
//   content: string; // type Message 
//   onMessageDelete: ({message,onMessageDelete}:MessageCardProps) => void
// }
// const MessageCard = ({message,onMessageDelete}:MessageCardProps) => {
//   const handleDeleteConfirm = async () => {
//     const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
//     toast(response.data.message)
//     onMessageDelete(Message._id)
//   }

  return (
   <Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
     <AlertDialog>
      <AlertDialogTrigger asChild>
      <Button variant="destructive"><X className="w-5 h-5"/></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <CardDescription>Card Description</CardDescription>
    <CardAction>Card Action</CardAction>
  </CardHeader>
  <CardContent>
  </CardContent>
</Card>
  )
}

export default MessageCard
