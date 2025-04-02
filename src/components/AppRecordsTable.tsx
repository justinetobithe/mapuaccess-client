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
import { Record } from '@/types/Record';
import { useRecords } from '@/lib/RecordAPI';
import AppConfirmationDialog from './AppConfirmationDialog';
import { toast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { format } from "date-fns";

export default function AppRecordsTable() {
    const queryClient = useQueryClient();
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [searchKeyword, setSearchKeyword] = React.useState('');
    const [sorting, setSorting] = useState<SortingState>([]);

    const { data, isLoading } = useRecords(
        pageIndex + 1,
        pageSize,
        searchKeyword,
        sorting.map((item) => item.id).join(','),
        Boolean(sorting.map((item) => item.desc).join(','))
    );

    const columns: ColumnDef<Record>[] = [
        {
            accessorKey: 'owner',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    Owner
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => row.original.vehicle_registration?.vehicle?.user?.first_name + " " + row.original.vehicle_registration?.vehicle?.user?.last_name,
            enableSorting: true,
        },
        {
            accessorKey: 'vehicle',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    Vehicle
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => {
                const vehicle = row.original.vehicle_registration?.vehicle;
                return `${vehicle?.plate_number} ${vehicle?.make} ${vehicle?.model} ${vehicle?.year}`;
            },
            enableSorting: true,
        },
        {
            accessorKey: 'type',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    Type
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) =>
                row.original.type === 'entry' ? "Entry" : "Exit",
            enableSorting: true,
        },
        {
            accessorKey: 'recorded_at',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent'
                    onClick={() => column.toggleSorting()}
                >
                    Recorded At
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) =>
                row.original.recorded_at
                    ? format(new Date(row.original.recorded_at), 'MMM dd, yyyy')
                    : '—',
            enableSorting: true,
        },
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
        </div>
    );
}
