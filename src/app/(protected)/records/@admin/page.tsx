"use client"
import React, { useState } from 'react';
import AppRecordsTable from '@/components/AppRecordsTable';

const Page = () => {

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-[2rem] font-bold">Records</h1>
            </div>
            <AppRecordsTable />
        </>
    );
};

export default Page;
