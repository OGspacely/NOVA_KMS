import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#f3f4f6] p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm p-8 md:p-12">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <div className="prose prose-blue max-w-none text-gray-600">
          <p>Last updated: March 2026</p>
          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you create an account, use our services, or communicate with us. This may include your name, email address, and any other information you choose to provide.</p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to personalize your experience on our platform.</p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">3. Information Sharing</h2>
          <p>We do not share your personal information with third parties except as described in this privacy policy or with your consent.</p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">4. Security</h2>
          <p>We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.</p>
        </div>
      </div>
    </div>
  );
};
