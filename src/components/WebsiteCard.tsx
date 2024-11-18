import React from 'react';
import { Globe, Trash2, ExternalLink } from 'lucide-react';

interface WebsiteCardProps {
  id: string;
  name: string;
  domain: string;
  lastScan: string | null;
  onDelete: (id: string) => Promise<void>;
}

export function WebsiteCard({ id, name, domain, lastScan, onDelete }: WebsiteCardProps) {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this website?')) {
      await onDelete(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <Globe className="h-8 w-8 text-indigo-600" />
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">{domain}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500"
          title="Delete website"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-500">
          Last scan: {lastScan ? new Date(lastScan).toLocaleDateString() : 'Never'}
        </p>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button className="btn-primary text-sm">
          Scan Now
        </button>
        <a
          href={`https://${domain}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-700"
        >
          <ExternalLink className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}