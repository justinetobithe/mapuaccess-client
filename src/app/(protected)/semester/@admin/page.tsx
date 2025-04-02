"use client"
import React, { useState } from 'react';
import AppSemesterTable from '@/components/AppSemesterTable';
import { Button } from '@/components/ui/button';
import { Plus } from "lucide-react";
import AppSemesterForm from '@/components/AppSemesterForm';
import { useQueryClient } from '@tanstack/react-query';


const Page = () => {
  const queryClient = useQueryClient();
  const [isAddSemesterDialogOpen, setIsAddSemesterDialogOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[2rem] font-bold">Semesters</h1>
        <Button className="ml-auto" onClick={() => { setIsAddSemesterDialogOpen(true) }}>
          <Plus className="mr-2" />Add Semester
        </Button>
      </div>
      <AppSemesterTable />
      {
        isAddSemesterDialogOpen && (
          <AppSemesterForm
            onClose={() => setIsAddSemesterDialogOpen(false)}
            isOpen={isAddSemesterDialogOpen}
            queryClient={queryClient}
          />
        )
      }
    </>
  );
};

export default Page;
