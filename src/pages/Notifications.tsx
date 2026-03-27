import React, { useState } from 'react';
import { Bell, CheckCircle, Clock } from 'lucide-react';

export const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New assignment posted in Mathematics', time: '2 hours ago', unread: true, type: 'assignment' },
    { id: 2, text: 'Your article was approved by the admin', time: '1 day ago', unread: true, type: 'article' },
    { id: 3, text: 'New practice quiz available for Integrated Science', time: '2 days ago', unread: false, type: 'quiz' },
    { id: 4, text: 'Your submission for "Algebra Basics" was graded', time: '3 days ago', unread: false, type: 'grade' },
    { id: 5, text: 'New comment on your forum post', time: '1 week ago', unread: false, type: 'forum' },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Bell className="w-8 h-8 text-blue-600" />
          Notifications
        </h1>
        <button 
          onClick={markAllAsRead}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors"
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                onClick={() => markAsRead(notification.id)}
                className={`p-6 flex items-start gap-4 transition-colors cursor-pointer hover:bg-gray-50 ${notification.unread ? 'bg-blue-50/30' : ''}`}
              >
                <div className={`p-3 rounded-full shrink-0 ${notification.unread ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                  {notification.type === 'assignment' || notification.type === 'quiz' ? <Clock className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                  <p className={`text-lg ${notification.unread ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                    {notification.text}
                  </p>
                  <span className="text-sm text-gray-500 mt-1 block">{notification.time}</span>
                </div>
                {notification.unread && (
                  <div className="w-3 h-3 bg-blue-600 rounded-full shrink-0 mt-2"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">You have no notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
};
