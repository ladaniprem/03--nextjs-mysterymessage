'use client'
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from 'sonner';
import { zodResolver } from "@hookform/resolvers/zod";
import { VerifySchema } from "@/schemas/verifySchema";
import { useForm } from "react-hook-form";
import * as z from 'zod'
import axios, { AxiosError } from 'axios';
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const VerifyAccount = () => {
    const router = useRouter()
    const param = useParams<{ username: string }>()
    const form = useForm<z.infer<typeof VerifySchema>>({
        resolver: zodResolver(VerifySchema),
    })

    const onsubmit = async (data: z.infer<typeof VerifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: param.username,
                code: data.code
            })
            toast.success(response.data.message)
            router.replace('sign-in')
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error("signup failed", {
                description: axiosError.response?.data.message ?? "An error occurred",
            });

        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        verify Your Account
                    </h1>
                    <p className="mb-4">Enter the Verification code Sent to your email </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
export default VerifyAccount