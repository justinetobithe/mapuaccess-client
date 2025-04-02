'use client';
import React, { useState } from 'react';
import {
    ColumnDef,
    PaginationState,
    SortingState,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from '@/components/ui/skeleton';
import AppTable from '@/components/AppTable';
import { ArrowUpDown, Pencil, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Semester } from '@/types/Semester';
import { useUpdateSemester, useSemesters, useDeleteSemester } from '@/lib/SemesterAPI';
import AppConfirmationDialog from './AppConfirmationDialog';
import { toast } from '@/components/ui/use-toast';
import AppSemesterForm from './AppSemesterForm';
import { useQueryClient } from '@tanstack/react-query';
import { format } from "date-fns";

export default function AppSemesterTable() {
    const queryClient = useQueryClient();
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [searchKeyword, setSearchKeyword] = React.useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);

    const { data, isLoading } = useSemesters(
        pageIndex + 1,
        pageSize,
        searchKeyword,
        sorting.map((item) => item.id).join(','),
        Boolean(sorting.map((item) => item.desc).join(','))
    );

    const { mutate } = useDeleteSemester();
    const { mutate: updateSemester } = useUpdateSemester();

    const handleEditSemester = (semester: Semester) => {
        setSelectedSemester(semester);
        setIsEditDialogOpen(true);
    };

    const handleDeleteSemester = (id: number) => {
        mutate(id, {
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: ['semesters'] });
            }
        });
    };

    const columns: ColumnDef<Semester>[] = [
        {
            accessorKey: 'school_year',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    School Year
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => row.original.school_year,
            enableSorting: true,
        },
        {
            accessorKey: 'semester',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    Semester
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => row.original.semester,
            enableSorting: true,
        },
        {
            accessorKey: 'start_date',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    Start Date
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) =>
                row.original.start_date
                    ? format(new Date(row.original.start_date), 'MMM dd, yyyy')
                    : '—',
            enableSorting: true,
        },
        {
            accessorKey: 'end_date',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    End Date
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) =>
                row.original.end_date
                    ? format(new Date(row.original.end_date), 'MMM dd, yyyy')
                    : '—',
            enableSorting: true,
        },
        {
            accessorKey: 'is_active',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    Status
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => (
                row.original.is_active === 1 ? (
                    <span className="text-green-600 font-semibold">Active</span>
                ) : (
                    ''
                )
            ),
            enableSorting: true,
        },
        {
            id: 'actions',
            header: () => <div className='text-center'>Actions</div>,
            cell: ({ row }) => (
                <div className="flex justify-center items-center">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type='button'
                                    variant="outline"
                                    className="mr-2"
                                    onClick={() => handleEditSemester(row.original)}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Edit</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <AppConfirmationDialog
                        title='Delete Semester'
                        description={`Are you sure you want to delete the semester "${row.original.school_year}"? This action cannot be undone.`}
                        buttonElem={
                            <Button className="text-white" variant="destructive" type='button'>
                                <Trash size={20} />
                            </Button>
                        }
                        handleDialogAction={() => handleDeleteSemester(row.original.id!)}
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        }
    ];

    const pagination = React.useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

    const table = useReactTable({
        data: data?.data ?? Array(10).fill({}),
        columns: isLoading
            ? columns.map((column) => ({ ...column, cell: () => <Skeleton className='h-12 w-full' /> }))
            : columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        onPaginationChange: setPagination,
        onGlobalFilterChange: setSearchKeyword,
        pageCount: data?.last_page ?? -1,
        manualPagination: true,
        manualFiltering: true,
        manualSorting: true,
        state: {
            sorting,
            pagination,
            globalFilter: searchKeyword,
        },
    });

    return (
        <div>
            <AppTable table={table} />
            {selectedSemester && (
                <AppSemesterForm
                    data={selectedSemester}
                    isOpen={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    queryClient={queryClient}
                />
            )}
        </div>
    );
}
