import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MessageCircle, Phone } from 'lucide-react';

export const Support = () => {
  return (
    <div className="min-h-screen bg-[#f3f4f6] p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm p-8 md:p-12">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Support Center</h1>
        <p className="text-gray-600 mb-12">How can we help you today? Choose an option below to get in touch with our team.</p>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-sm text-gray-500 mb-4">Send us an email and we'll get back to you within 24 hours.</p>
            <a href="mailto:support@novakms.com" className="text-blue-600 font-medium text-sm hover:underline">support@novakms.com</a>
          </div>
          
          <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-sm text-gray-500 mb-4">Chat with our support team in real-time during business hours.</p>
            <button className="text-green-600 font-medium text-sm hover:underline">Start Chat</button>
          </div>
          
          <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-sm text-gray-500 mb-4">Call us directly for urgent matters. Available Mon-Fri, 9am-5pm EST.</p>
            <a href="tel:+18005550199" className="text-purple-600 font-medium text-sm hover:underline">+1 (800) 555-0199</a>
          </div>
        </div>
      </div>
    </div>
  );
};
