// 'use client';
// import React, { useState } from 'react';
// import {
//     ColumnDef,
//     PaginationState,
//     SortingState,
//     getCoreRowModel,
//     useReactTable,
// } from '@tanstack/react-table';
// import { Button } from '@/components/ui/button';
// import {
//     Tooltip,
//     TooltipContent,
//     TooltipProvider,
//     TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { Skeleton } from '@/components/ui/skeleton';
// import AppTable from '@/components/AppTable';
// import { ArrowUpDown, Pencil, Trash } from 'lucide-react';
// import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
// import { Vehicle } from '@/types/Vehicle';
// import { useDeleteVehicle, useUpdateVehicle, useVehicles } from '@/lib/VehicleAPI';
// import AppConfirmationDialog from './AppConfirmationDialog';
// import { toast } from '@/components/ui/use-toast';
// import AppVehicleForm from './AppVehicleForm';
// import { useQueryClient } from '@tanstack/react-query';
// import Image from 'next/image';

// export default function AppVehiclesTable() {
//     const queryClient = useQueryClient();
//     const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
//         pageIndex: 0,
//         pageSize: 10,
//     });
//     const [searchKeyword, setSearchKeyword] = React.useState('');
//     const [sorting, setSorting] = useState<SortingState>([]);
//     const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//     const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

//     const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
//     const [selectedImage, setSelectedImage] = useState<string | null>(null);

//     const { data, isLoading } = useVehicles(
//         pageIndex + 1,
//         pageSize,
//         searchKeyword,
//         sorting.map((item) => item.id).join(','),
//         Boolean(sorting.map((item) => item.desc).join(','))
//     );

//     const columns: ColumnDef<Vehicle>[] = [
//         {
//             accessorKey: 'image',
//             header: 'Image',
//             cell: ({ row }) => {
//                 const item = row.original;
//                 const imageUrl = `${process.env.NEXT_PUBLIC_API_URL || ''}/storage/image/${item.image}`;

//                 return imageUrl ? (
//                     <>
//                         <Image
//                             src={imageUrl}
//                             alt="Vehicle Image"
//                             width={80}
//                             height={80}
//                             className="h-20 w-20 cursor-pointer object-cover"
//                             onClick={() => {
//                                 setSelectedImage(imageUrl);
//                                 setIsImageDialogOpen(true);
//                             }}
//                         />
//                         <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
//                             <DialogContent className="absolute flex justify-center items-center">
//                                 <button
//                                     onClick={() => setIsImageDialogOpen(false)}
//                                     className="absolute text-white p-2 rounded-full"
//                                 >
//                                     Close
//                                 </button>
//                                 {selectedImage && (
//                                     <Image
//                                         src={selectedImage}
//                                         alt="Selected Image"
//                                         width={500}
//                                         height={500}
//                                         className="max-w-full max-h-full object-contain"
//                                     />
//                                 )}
//                             </DialogContent>
//                         </Dialog>
//                     </>
//                 ) : (
//                     <div className="h-20 w-20 bg-gray-300" />
//                 );
//             },
//         },
//         {
//             accessorKey: 'plate_number',
//             header: ({ column }) => (
//                 <Button
//                     variant='ghost'
//                     className='pl-0 text-left hover:!bg-transparent'
//                     onClick={() => column.toggleSorting()}
//                 >
//                     Plate No.
//                     <ArrowUpDown className='ml-2 h-4 w-4' />
//                 </Button>
//             ),
//             cell: ({ row }) => row.original.plate_number,
//             enableSorting: true,
//         },
//         {
//             accessorKey: 'make',
//             header: ({ column }) => (
//                 <Button
//                     variant='ghost'
//                     className='pl-0 text-left hover:!bg-transparent'
//                     onClick={() => column.toggleSorting()}
//                 >
//                     Brand
//                     <ArrowUpDown className='ml-2 h-4 w-4' />
//                 </Button>
//             ),
//             cell: ({ row }) => row.original.make,
//             enableSorting: true,
//         },
//         {
//             accessorKey: 'model',
//             header: ({ column }) => (
//                 <Button
//                     variant='ghost'
//                     className='pl-0 text-left hover:!bg-transparent'
//                     onClick={() => column.toggleSorting()}
//                 >
//                     Model
//                     <ArrowUpDown className='ml-2 h-4 w-4' />
//                 </Button>
//             ),
//             cell: ({ row }) => row.original.model,
//             enableSorting: true,
//         },
//         {
//             accessorKey: 'year',
//             header: ({ column }) => (
//                 <Button
//                     variant='ghost'
//                     className='pl-0 text-left hover:!bg-transparent'
//                     onClick={() => column.toggleSorting()}
//                 >
//                     Year
//                     <ArrowUpDown className='ml-2 h-4 w-4' />
//                 </Button>
//             ),
//             cell: ({ row }) => row.original.year,
//             enableSorting: true,
//         },
//         {
//             accessorKey: 'type',
//             header: ({ column }) => (
//                 <Button
//                     variant='ghost'
//                     className='pl-0 text-left hover:!bg-transparent'
//                     onClick={() => column.toggleSorting()}
//                 >
//                     Type
//                     <ArrowUpDown className='ml-2 h-4 w-4' />
//                 </Button>
//             ),
//             cell: ({ row }) => row.original.type,
//             enableSorting: true,
//         },
//         {
//             accessorKey: 'owner',
//             header: ({ column }) => (
//                 <Button
//                     variant='ghost'
//                     className='pl-0 text-left hover:!bg-transparent'
//                     onClick={() => column.toggleSorting()}
//                 >
//                     Owner
//                     <ArrowUpDown className='ml-2 h-4 w-4' />
//                 </Button>
//             ),
//             cell: ({ row }) => {
//                 const user = row.original.user;
//                 if (user && user.first_name && user.last_name) {
//                     return `${user.first_name} ${user.last_name}`;
//                 }
//                 return "";
//             },
//             enableSorting: true,
//         },
//     ];

//     const pagination = React.useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

//     const table = useReactTable({
//         data: data?.data ?? Array(10).fill({}),
//         columns: isLoading
//             ? columns.map((column) => ({ ...column, cell: () => <Skeleton className='h-12 w-full' /> }))
//             : columns,
//         onSortingChange: setSorting,
//         getCoreRowModel: getCoreRowModel(),
//         onPaginationChange: setPagination,
//         onGlobalFilterChange: setSearchKeyword,
//         pageCount: data?.last_page ?? -1,
//         manualPagination: true,
//         manualFiltering: true,
//         manualSorting: true,
//         state: {
//             sorting,
//             pagination,
//             globalFilter: searchKeyword,
//         },
//     });

//     return (
//         <div>
//             <AppTable table={table} />
//             {selectedVehicle && (
//                 <AppVehicleForm
//                     data={selectedVehicle}
//                     isOpen={isEditDialogOpen}
//                     onClose={() => setIsEditDialogOpen(false)}
//                     queryClient={queryClient}
//                 />
//             )}
//         </div>
//     );
// }
