import React, { FC, useEffect, useState } from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Form, FormControl, FormField, FormItem, FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { useCreateUser, useUpdateUser } from '@/lib/UsersAPI';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import User from "@/types/User";
import AppSpinner from './AppSpinner';
import { QueryClient } from '@tanstack/react-query';
import Select from 'react-select';

const userSchema = z.object({
    first_name: z.string().min(3, { message: 'First name is required' }),
    last_name: z.string().min(3, { message: 'Last name is required' }),
    email: z.string().email({ message: 'Email is invalid' }),
    phone: z.string().optional(),
    address: z.string().optional(),
    role: z.string().min(3, { message: 'Role is required' }),
    password: z.string().optional(),
    new_password: z.string().optional(),
    confirm_password: z.string().optional(),
}).refine(data => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
});

export type UserInput = z.infer<typeof userSchema>;

interface AppUserFormProps {
    data?: User;
    isOpen: boolean;
    onClose: () => void;
    queryClient: QueryClient;
}

const roleOptions = [
    { value: "admin", label: "admin" },
    { value: "guard", label: "guard" },
    { value: "parent", label: "parent" },
    { value: "student", label: "student" },
]

const AppUserForm: FC<AppUserFormProps> = ({ data, isOpen, onClose, queryClient }) => {
    const [loading, setLoading] = useState(false);

    const form = useForm<UserInput>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            first_name: data?.first_name || '',
            last_name: data?.last_name || '',
            email: data?.email || '',
            phone: data?.phone || '',
            address: data?.address || '',
            role: data?.role || '',
        },
    });

    useEffect(() => {
        if (data) {
            form.reset({
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                phone: data.phone,
                address: data.address,
                role: data.role,
            });
        }
    }, [data, form]);

    const { mutate: createUser, isPending: isCreating } = useCreateUser();
    const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

    const onSubmit = async (formData: UserInput) => {
        setLoading(true);
        if (data && data.id) {
            await updateUser({ id: data.id, userData: formData }, {
                onSettled: () => {
                    onClose();
                    queryClient.invalidateQueries({ queryKey: ['users'] });
                },
            });
        } else {
            await createUser(formData, {
                onSettled: () => {
                    onClose();
                    queryClient.invalidateQueries({ queryKey: ['users'] });
                },
            });
        }
        setLoading(false);
    };

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{data ? 'Edit User' : 'Add User'}</AlertDialogTitle>
                </AlertDialogHeader>
                <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                            <FormField
                                control={form.control}
                                name='first_name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input type='text' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='last_name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input type='text' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type='email' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='phone'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input type='text' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='address'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input type='text' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <Controller
                                            control={form.control}
                                            name="role"
                                            render={({ field }) => (
                                                <Select
                                                    value={roleOptions.find(option => option.value === field.value) || null}
                                                    onChange={(option) => {
                                                        field.onChange(option?.value);
                                                    }}
                                                    options={roleOptions}
                                                />
                                            )}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='mt-5 flex space-x-2'>
                                <Button variant="outline" onClick={onClose}>Close</Button>
                                <Button type="submit" variant="default" className="text-white" disabled={isCreating || isUpdating}>
                                    {loading ? <AppSpinner /> : (data ? 'Save' : 'Add')}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AppUserForm;
