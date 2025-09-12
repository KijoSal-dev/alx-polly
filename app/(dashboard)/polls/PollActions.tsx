'use client';

import Link from 'next/link';
import { useAuth } from '@/app/lib/context/auth-context';
import { Button } from '@/components/ui/button';
import { deletePoll } from '@/app/lib/actions/poll-actions';
import { useState } from 'react';
import { format } from 'date-fns';

interface Poll {
  id: string;
  question: string;
  options: any[];
  user_id: string;
  expires_at: string | null;
}

interface PollActionsProps {
  poll: Poll;
}

export default function PollActions({ poll }: PollActionsProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!user || user.id !== poll.user_id) return;
    if (confirm('Are you sure you want to delete this poll?')) {
      setLoading(true);
      setError(null);
      const result = await deletePoll(poll.id);
      setLoading(false);
      if (result?.error) {
        setError(result.error);
      } else {
        window.location.reload();
      }
    }
  };

  const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date();

  return (
    <div className="border rounded-md shadow-md hover:shadow-lg transition-shadow bg-white">
      <Link href={`/polls/${poll.id}`}>
        <div className="group p-4">
          <div className="h-full">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="group-hover:text-blue-600 transition-colors font-bold text-lg">
                  {poll.question}
                </h2>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${isExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {isExpired ? 'Closed' : 'Open'}
                </span>
              </div>
              <p className="text-slate-500">{poll.options.length} options</p>
              {poll.expires_at && (
                <p className="text-sm text-slate-500 mt-2">
                  Expires on: {format(new Date(poll.expires_at), 'PPP')}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
      {user && user.id === poll.user_id && (
        <div className="flex gap-2 p-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/polls/${poll.id}/edit`}>Edit</Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      )}
      {error && <div className="p-2 text-red-500 text-sm">{error}</div>}
    </div>
  );
}