import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    location: '',
    date: '',
    time: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    navigate(`/babysitters?${params.toString()}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-6">
      <div className="flex-1">
        <label htmlFor="location" className="sr-only">
          Location
        </label>
        <input
          type="text"
          name="location"
          id="location"
          value={searchParams.location}
          onChange={handleChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="Enter your location"
        />
      </div>
      <div className="sm:w-40">
        <label htmlFor="date" className="sr-only">
          Date
        </label>
        <input
          type="date"
          name="date"
          id="date"
          value={searchParams.date}
          onChange={handleChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>
      <div className="sm:w-40">
        <label htmlFor="time" className="sr-only">
          Time
        </label>
        <input
          type="time"
          name="time"
          id="time"
          value={searchParams.time}
          onChange={handleChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700"
      >
        Search
      </button>
    </form>
  );
} 