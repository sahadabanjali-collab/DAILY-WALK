import React, { useState } from 'react';
import { MapPin, Phone, Clock, Navigation, Search, CheckCircle2 } from 'lucide-react';

export const StoreLocatorPage: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<'all' | 'mumbai' | 'delhi' | 'bangalore'>('all');

  const retailStores = [
    {
      id: 'mumbai-flagship',
      name: 'Daily Walk Flagship Experience Store',
      city: 'mumbai',
      cityName: 'Mumbai',
      address: 'Level 2, Palladium Mall, High Street Phoenix, Lower Parel',
      phone: '+91 22 6123 4567',
      hours: 'Mon – Sun: 11:00 AM – 9:30 PM',
      services: ['3D Foot Scanning', 'Sneaker Cleaning Bar', 'Same-Day Pickup'],
    },
    {
      id: 'mumbai-bandra',
      name: 'Daily Walk Studio Bandra',
      city: 'mumbai',
      cityName: 'Mumbai',
      address: 'Shop 4, Linking Road, Near KFC, Bandra West',
      phone: '+91 22 6123 9876',
      hours: 'Mon – Sun: 10:30 AM – 9:00 PM',
      services: ['Size Exchanges', 'Custom Lacing'],
    },
    {
      id: 'delhi-saket',
      name: 'Daily Walk Select CityWalk',
      city: 'delhi',
      cityName: 'New Delhi',
      address: 'Ground Floor, A-3 District Centre, Saket',
      phone: '+91 11 4123 7890',
      hours: 'Mon – Sun: 10:30 AM – 10:00 PM',
      services: ['3D Foot Scanning', 'VIP Try-on Lounge'],
    },
    {
      id: 'bangalore-indiranagar',
      name: 'Daily Walk Indiranagar',
      city: 'bangalore',
      cityName: 'Bengaluru',
      address: '100 Feet Road, HAL 2nd Stage, Indiranagar',
      phone: '+91 80 4123 5566',
      hours: 'Mon – Sun: 11:00 AM – 9:30 PM',
      services: ['Running Gait Analysis', 'Same-Day Pickup'],
    },
  ];

  const filteredStores =
    selectedCity === 'all'
      ? retailStores
      : retailStores.filter((s) => s.city === selectedCity);

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
            <MapPin className="w-4 h-4 text-neutral-900" />
            VISIT US IN PERSON
          </div>
          <h1 className="font-heading font-black text-4xl sm:text-5xl text-[#111111] tracking-tight leading-tight">
            Find a Daily Walk Store Near You.
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl">
            Step in for precision 3D foot scanning, gait analysis, sneaker cleaning, and instant in-person size exchanges.
          </p>
        </div>

        {/* City Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-gray-100">
          <button
            onClick={() => setSelectedCity('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
              selectedCity === 'all'
                ? 'bg-black text-white'
                : 'bg-[#F6F6F6] text-neutral-600 hover:text-black'
            }`}
          >
            All Cities ({retailStores.length})
          </button>
          <button
            onClick={() => setSelectedCity('mumbai')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
              selectedCity === 'mumbai'
                ? 'bg-black text-white'
                : 'bg-[#F6F6F6] text-neutral-600 hover:text-black'
            }`}
          >
            Mumbai (2)
          </button>
          <button
            onClick={() => setSelectedCity('delhi')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
              selectedCity === 'delhi'
                ? 'bg-black text-white'
                : 'bg-[#F6F6F6] text-neutral-600 hover:text-black'
            }`}
          >
            New Delhi (1)
          </button>
          <button
            onClick={() => setSelectedCity('bangalore')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
              selectedCity === 'bangalore'
                ? 'bg-black text-white'
                : 'bg-[#F6F6F6] text-neutral-600 hover:text-black'
            }`}
          >
            Bengaluru (1)
          </button>
        </div>

        {/* Store Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredStores.map((store) => (
            <div
              key={store.id}
              className="bg-white border border-gray-200 hover:border-black rounded-2xl p-6 flex flex-col justify-between transition-colors space-y-4"
            >
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-[#F6F6F6] px-2.5 py-1 rounded-md">
                  {store.cityName}
                </span>

                <h3 className="font-heading font-black text-lg text-neutral-900 leading-snug">
                  {store.name}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {store.address}
                </p>

                <div className="space-y-1.5 pt-2 text-xs text-neutral-500">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{store.hours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{store.phone}</span>
                  </div>
                </div>

                {/* Services */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {store.services.map((svc, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold text-neutral-600 bg-[#F6F6F6] px-2 py-0.5 rounded-md"
                    >
                      ✓ {svc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  ● Open Today
                </span>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(store.name + ' ' + store.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-black text-white text-xs font-bold rounded-full hover:bg-neutral-800 transition-colors inline-flex items-center gap-1.5"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
