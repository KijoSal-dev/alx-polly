'use client';

import { useState } from 'react';
import { castVote, getPollResults } from '@/app/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ClientApiExampleProps {
  pollId: string;
}

export default function ClientApiExample({ pollId }: ClientApiExampleProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  
  const [results, setResults] = useState<any>(null);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [resultsError, setResultsError] = useState<string | null>(null);

  // Example of using the castVote function
  const handleVote = async () => {
    if (selectedOption === null) {
      setVoteError('Please select an option');
      return;
    }

    setIsVoting(true);
    setVoteError(null);

    try {
      const { error } = await castVote(pollId, selectedOption);
      
      if (error) {
        setVoteError(error);
      } else {
        // Vote successful, now fetch updated results
        fetchResults();
      }
    } catch (err) {
      setVoteError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsVoting(false);
    }
  };

  // Example of using the getPollResults function
  const fetchResults = async () => {
    setIsLoadingResults(true);
    setResultsError(null);

    try {
      const { data, error } = await getPollResults(pollId);
      
      if (error) {
        setResultsError(error);
      } else {
        setResults(data);
      }
    } catch (err) {
      setResultsError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoadingResults(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Voting Section */}
      <Card>
        <CardHeader>
          <CardTitle>Cast Your Vote</CardTitle>
          <CardDescription>Select an option and submit your vote</CardDescription>
        </CardHeader>
        <CardContent>
          {results?.options ? (
            <div className="space-y-4">
              {results.options.map((option: any, index: number) => (
                <div 
                  key={index} 
                  className={`p-4 border rounded-md cursor-pointer ${selectedOption === index ? 'border-primary bg-primary/10' : 'border-gray-200'}`}
                  onClick={() => setSelectedOption(index)}
                >
                  {option.text}
                </div>
              ))}
            </div>
          ) : (
            <div>Loading options...</div>
          )}
          
          {voteError && (
            <div className="mt-4 p-2 bg-red-50 text-red-600 rounded-md">
              {voteError}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleVote} disabled={isVoting || selectedOption === null}>
            {isVoting ? 'Submitting...' : 'Submit Vote'}
          </Button>
          <Button variant="outline" className="ml-2" onClick={fetchResults} disabled={isLoadingResults}>
            {isLoadingResults ? 'Loading...' : 'Refresh Results'}
          </Button>
        </CardFooter>
      </Card>

      {/* Results Section */}
      <Card>
        <CardHeader>
          <CardTitle>Poll Results</CardTitle>
          <CardDescription>Real-time results for this poll</CardDescription>
        </CardHeader>
        <CardContent>
          {resultsError ? (
            <div className="p-2 bg-red-50 text-red-600 rounded-md">
              {resultsError}
            </div>
          ) : results ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{results.poll.question}</h3>
              <p className="text-sm text-gray-500">Total votes: {results.totalVotes}</p>
              
              {results.options.map((option: any, index: number) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between">
                    <span>{option.text}</span>
                    <span>{option.votes} votes ({option.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${option.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              {isLoadingResults ? 'Loading results...' : 'Click "Refresh Results" to load poll data'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}