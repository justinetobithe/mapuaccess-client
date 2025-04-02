import { api } from '@/lib/api';
import { Record } from '@/types/Record';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const getRecords = async (
    page: number = 1,
    pageSize: number = 10,
    filter = '',
    sortColumn = '',
    sortDesc = false
): Promise<{ data: Record[]; last_page: number }> => {
    const response = await api.get<{ data: { data: Record[]; current_page: number; last_page: number; total: number } }>(`/api/records`, {
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

export const useRecords = (
    page: number = 1,
    pageSize: number = 10,
    globalFilter = '',
    sortColumn = '',
    sortDesc = false
) =>
    useQuery({
        queryKey: ['records', page, pageSize, globalFilter, sortColumn, sortDesc],
        queryFn: async (): Promise<{ data: Record[]; last_page: number }> => {
            return await getRecords(page, pageSize, globalFilter, sortColumn, sortDesc);
        },
    });
