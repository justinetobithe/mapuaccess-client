"use client"
import AppVehiclesTable from '@/components/AppVehiclesTable';
import React, { useState } from 'react';

const Page = () => {
    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-[2rem] font-bold">Vehicles</h1>
            </div>
            <AppVehiclesTable />
        </>
    );
};

export default Page;
