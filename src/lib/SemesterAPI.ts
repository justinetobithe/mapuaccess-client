import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import Response from '@/types/Response';
import { Semester } from '@/types/Semester';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const getSemesters = async (
    page: number = 1,
    pageSize: number = 10,
    filter = '',
    sortColumn = '',
    sortDesc = false
): Promise<{ data: Semester[]; last_page: number }> => {
    const response = await api.get<{ data: { data: Semester[]; current_page: number; last_page: number; total: number } }>(`/api/semesters`, {
        params: {
            page,
            ...(pageSize && { page_size: pageSize }),
            ...(filter && { filter }),
            ...(sortColumn && { sort_column: sortColumn }),
            sort_desc: sortDesc,
        },
    });

    const { data } = response.data;

    return {
        data: data.data,
        last_page: data?.last_page,
    };
};

export const createSemester = async (inputs: Semester): Promise<Response> => {
    const response = await api.post<Response>(`/api/semester`, inputs);
    return response.data;
};

export const updateSemester = async (id: number, inputs: Semester): Promise<Response> => {
    const response = await api.put<Response>(`/api/semester/${id}`, inputs);
    return response.data;
};

export const deleteSemester = async (id: number): Promise<Response> => {
    const response = await api.delete(`/api/semester/${id}`);
    return response.data;
};

export const useSemesters = (
    page: number = 1,
    pageSize: number = 10,
    globalFilter = '',
    sortColumn = '',
    sortDesc = false
) =>
    useQuery({
        queryKey: ['semesters', page, pageSize, globalFilter, sortColumn, sortDesc],
        queryFn: async (): Promise<{ data: Semester[]; last_page: number }> => {
            return await getSemesters(page, pageSize, globalFilter, sortColumn, sortDesc);
        },
    });

export const useCreateSemester = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (inputs: Semester) => {
            return await createSemester(inputs);
        },
        onSuccess: (response) => {
            if (response && response.status === "success") {
                queryClient.invalidateQueries({ queryKey: ['semesters'] });
                toast({
                    variant: 'success',
                    description: response.message,
                });
            }
        },
    });
};

export const useUpdateSemester = () => {
    return useMutation({
        mutationFn: async ({ id, semesterData }: { id: number; semesterData: Semester }) => {
            return await updateSemester(id, semesterData);
        },
        onSuccess: (response) => {
            if (response && response.status === "success") {
                toast({
                    variant: 'success',
                    description: response.message,
                });
            }
        },
    });
};

export const useDeleteSemester = () => {
    return useMutation({
        mutationFn: async (id: number) => {
            return await deleteSemester(id);
        },
        onSuccess: (response) => {
            if (response && response.status === "success") {
                toast({
                    variant: 'success',
                    description: response.message,
                });
            }
        },
    });
};
