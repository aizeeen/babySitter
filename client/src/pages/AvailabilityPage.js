import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AvailabilityForm from '../components/AvailabilityForm';

export default function AvailabilityPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Manage Your Availability</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <AvailabilityForm />
      </div>
    </div>
  );
} 