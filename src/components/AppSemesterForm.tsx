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
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { Button } from '@/components/ui/button';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { useCreateSemester, useUpdateSemester } from '@/lib/SemesterAPI';
import AppSpinner from './AppSpinner';
import { QueryClient } from '@tanstack/react-query';
import { Semester } from '@/types/Semester';
import { zodResolver } from '@hookform/resolvers/zod';
import Select from 'react-select';
import { Switch } from '@/components/ui/switch';

const semesterOptions = [
    { value: "1st", label: "First Semester" },
    { value: "2nd", label: "Second Semester" },
    { value: "summer", label: "Summer" },
];

const semesterSchema = z.object({
    id: z.number().optional(),
    school_year: z.string().min(4, { message: 'School year is required' }),
    semester: z.string().min(1, { message: 'Semester is required' }),
    start_date: z.string().regex(/\d{4}-\d{2}-\d{2}/, { message: 'Invalid date format (YYYY-MM-DD)' }),
    end_date: z.string().regex(/\d{4}-\d{2}-\d{2}/, { message: 'Invalid date format (YYYY-MM-DD)' }),
    is_active: z.boolean(),
});

export type SemesterInput = z.infer<typeof semesterSchema>;

interface AppSemesterFormProps {
    data?: Semester;
    isOpen: boolean;
    onClose: () => void;
    queryClient: QueryClient;
}

const AppSemesterForm: FC<AppSemesterFormProps> = ({ data, isOpen, onClose, queryClient }) => {
    const [loading, setLoading] = useState(false);

    const form = useForm<SemesterInput>({
        resolver: zodResolver(semesterSchema),
        defaultValues: {
            id: data?.id,
            school_year: data?.school_year || '',
            semester: data?.semester || '',
            start_date: data?.start_date || '',
            end_date: data?.end_date || '',
            is_active: !!data?.is_active,
        },
    });

    useEffect(() => {
        if (data) {
            form.reset({
                school_year: data.school_year,
                semester: data.semester,
                start_date: data.start_date,
                end_date: data.end_date,
                is_active: !!data.is_active,
            });
        }
    }, [data, form]);

    const { mutate: createSemester, isPending: isCreating } = useCreateSemester();
    const { mutate: updateSemester, isPending: isUpdating } = useUpdateSemester();

    const onSubmit = async (formData: SemesterInput) => {
        setLoading(true);

        if (data && data.id) {
            await updateSemester(
                { id: data.id, semesterData: formData },
                {
                    onSettled: () => {
                        onClose();
                        queryClient.invalidateQueries({ queryKey: ['semesters'] });
                    },
                }
            );
        } else {
            await createSemester(formData, {
                onSettled: () => {
                    onClose();
                    queryClient.invalidateQueries({ queryKey: ['semesters'] });
                },
            });
        }
        setLoading(false);
    };

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{data ? 'Edit Semester' : 'Add Semester'}</AlertDialogTitle>
                </AlertDialogHeader>
                <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                            <FormField
                                control={form.control}
                                name='semester'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Semester</FormLabel>
                                        <FormControl>
                                            <Input type='text' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Controller
                                control={form.control}
                                name='start_date'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Date</FormLabel>
                                        <FormControl>
                                            <DatePicker
                                                onChange={(date) => field.onChange(date || null)}
                                                value={field.value}
                                                format='y-MM-dd'
                                                clearIcon={null}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Controller
                                control={form.control}
                                name='end_date'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Date</FormLabel>
                                        <FormControl>
                                            <DatePicker
                                                onChange={(date) => field.onChange(date || null)}
                                                value={field.value}
                                                format='y-MM-dd'
                                                clearIcon={null}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="semester"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Semester</FormLabel>
                                        <Controller
                                            control={form.control}
                                            name="semester"
                                            render={({ field }) => (
                                                <Select
                                                    value={semesterOptions.find(option => option.value === field.value) || null}
                                                    options={semesterOptions}
                                                    onChange={option => field.onChange(option?.value)}
                                                    isClearable
                                                />
                                            )}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='is_active'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Active</FormLabel>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
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

export default AppSemesterForm;
