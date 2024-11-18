import React, { useState, useEffect } from 'react';
import { Plus, Globe, Cookie, Settings, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useWebsiteStore } from '../store/websiteStore';
import { AddWebsiteModal } from './AddWebsiteModal';
import { WebsiteCard } from './WebsiteCard';

export function Dashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { user, signOut } = useAuthStore();
  const { websites, loading, error, fetchWebsites, addWebsite, deleteWebsite } = useWebsiteStore();

  useEffect(() => {
    fetchWebsites();
  }, [fetchWebsites]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Cookie className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">CookieGuard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-700">
                <User className="h-5 w-5 mr-2" />
                {user?.email}
              </div>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Your Websites</h1>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Website
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {loading && websites.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading your websites...</p>
            </div>
          ) : websites.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Globe className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No websites yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding your first website.</p>
              <div className="mt-6">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Website
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {websites.map((website) => (
                <WebsiteCard
                  key={website.id}
                  id={website.id}
                  name={website.name}
                  domain={website.domain}
                  lastScan={website.last_scan}
                  onDelete={deleteWebsite}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <AddWebsiteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addWebsite}
      />
    </div>
  );
}