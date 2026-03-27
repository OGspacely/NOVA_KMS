import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-[#f3f4f6] p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm p-8 md:p-12">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <div className="prose prose-blue max-w-none text-gray-600">
          <p>Last updated: March 2026</p>
          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>By accessing or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">2. Use of Services</h2>
          <p>You agree to use our services only for lawful purposes and in accordance with these Terms. You are responsible for all activities that occur under your account.</p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">3. Intellectual Property</h2>
          <p>The services and their original content, features, and functionality are owned by Nova KMS and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">4. Termination</h2>
          <p>We may terminate or suspend your access to our services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
        </div>
      </div>
    </div>
  );
};
