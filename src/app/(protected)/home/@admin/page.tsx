"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import Image from 'next/image'; // Import Next.js Image component
import Mapua from '@public/img/mapua.jpeg'; // Path to the Mapua background image
import User from '@/types/User';

const Page = () => {
  const [user, setUser] = useState<User | null>(null);
  const [counts, setCounts] = useState({ students: 0, employees: 0, vehicles: 0 });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get<{ data: User }>("/api/me");
        setUser(data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="relative h-screen overflow-hidden">
      <Image
        src={Mapua}
        alt="Mapua Background"
        layout="fill"
        objectFit="cover"
        className="opacity-80"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white p-8 rounded-xl shadow-2xl max-w-2xl mx-auto">
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Welcome, {user.first_name} {user.last_name}</h1>
          <p className="text-xl mb-8 leading-relaxed">We're delighted to have you on board. Here's a quick overview of your dashboard:</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-3">Students</h3>
                <p className="text-4xl font-bold">1</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-600 to-green-400 text-white shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-3">Employees</h3>
                <p className="text-4xl font-bold">2</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-600 to-purple-400 text-white shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-3">Vehicles</h3>
                <p className="text-4xl font-bold">3</p>
              </CardContent>
            </Card>
          </div>

          <p className="text-lg text-gray-300">Thank you for being a valuable part of our system!</p>
        </div>
      </div>
    </div>
  );
};

export default Page;