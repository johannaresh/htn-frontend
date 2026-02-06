'use client';

import { useState } from 'react';
import { ContactFormModal } from '@/components/forms/ContactFormModal';

export const Sponsors = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const sponsors = [
    { name: 'Tech Corp', tier: 'Platinum' },
    { name: 'Innovation Labs', tier: 'Gold' },
    { name: 'Dev Tools Inc', tier: 'Silver' },
    { name: 'Cloud Systems', tier: 'Silver' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4 text-white">Our Sponsors</h1>
      <p className="text-gray-400 mb-12 text-lg">
        We&apos;re grateful for the support of our sponsors who help make our events possible.
      </p>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
        {sponsors.map((sponsor) => (
          <div key={sponsor.name} className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
            <div className="w-24 h-24 bg-gray-800 rounded mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-600 text-sm">Logo</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">{sponsor.name}</h3>
            <p className="text-cyan-400 text-sm">{sponsor.tier}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Interested in Sponsoring?</h2>
        <p className="text-gray-400 mb-6">
          Partner with us to reach a community of talented developers and innovators.
        </p>
        <button
          type="button"
          onClick={() => setIsContactModalOpen(true)}
          className="inline-block px-6 py-3 bg-white text-black rounded font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
        >
          Contact Us
        </button>
      </div>

      {/* Contact Form Modal */}
      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};
