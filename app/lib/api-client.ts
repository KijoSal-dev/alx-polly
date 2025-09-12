// app/lib/api-client.ts
import { createClient } from '@/lib/supabase/client';

/**
 * Cast a vote on an existing poll
 * 
 * @param pollId - The unique identifier of the poll
 * @param optionIndex - The index of the option being voted for
 * @returns An object containing either an error message or null if successful
 * 
 * @example
 * // Cast a vote for the first option (index 0) on a poll
 * const { error } = await castVote('123e4567-e89b-12d3-a456-426614174000', 0);
 * if (error) {
 *   console.error('Failed to cast vote:', error);
 * } else {
 *   console.log('Vote cast successfully!');
 * }
 */
export async function castVote(pollId: string, optionIndex: number) {
  const supabase = createClient();
  
  try {
    // First check if the poll exists and hasn't expired
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('expires_at')
      .eq('id', pollId)
      .single();

    if (pollError) {
      return { error: 'Poll not found.', status: 404 };
    }

    if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
      return { error: 'This poll has expired.', status: 400 };
    }

    // Get current user (if authenticated)
    const { data: { user } } = await supabase.auth.getUser();

    // Check if user has already voted (if authenticated)
    if (user) {
      const { data: existingVote, error: voteCheckError } = await supabase
        .from('votes')
        .select('id')
        .eq('poll_id', pollId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (!voteCheckError && existingVote) {
        return { error: 'You have already voted on this poll.', status: 400 };
      }
    }

    // Insert the vote
    const { error } = await supabase.from('votes').insert([
      {
        poll_id: pollId,
        user_id: user?.id ?? null,
        option_index: optionIndex,
      },
    ]);

    if (error) {
      console.error('Vote submission error:', error);
      return { error: error.message, status: 500 };
    }

    return { error: null, status: 200 };
  } catch (error) {
    console.error('Unexpected error during vote casting:', error);
    return { 
      error: 'An unexpected error occurred while casting your vote.', 
      status: 500 
    };
  }
}

/**
 * Retrieve results for a specific poll
 * 
 * @param pollId - The unique identifier of the poll
 * @returns An object containing poll results data or an error
 * 
 * @example
 * // Get results for a specific poll
 * const { data, error } = await getPollResults('123e4567-e89b-12d3-a456-426614174000');
 * if (error) {
 *   console.error('Failed to fetch poll results:', error);
 * } else {
 *   console.log('Poll results:', data);
 *   // data contains: poll details, options, vote counts, total votes
 * }
 */
export async function getPollResults(pollId: string) {
  const supabase = createClient();
  
  try {
    // First get the poll details
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('*')
      .eq('id', pollId)
      .single();

    if (pollError) {
      return { data: null, error: 'Poll not found.', status: 404 };
    }

    // Get all votes for this poll
    const { data: votes, error: votesError } = await supabase
      .from('votes')
      .select('option_index')
      .eq('poll_id', pollId);

    if (votesError) {
      return { data: null, error: votesError.message, status: 500 };
    }

    // Calculate vote counts for each option
    const voteCounts = poll.options.map((_: string, index: number) => {
      return votes.filter((vote: { option_index: number }) => vote.option_index === index).length;
    });

    // Calculate total votes
    const totalVotes = votes.length;

    // Calculate percentages
    const votePercentages = voteCounts.map((count: number) => {
      if (totalVotes === 0) return 0;
      return Math.round((count / totalVotes) * 100);
    });

    // Format the results
    const results = {
      poll: {
        id: poll.id,
        question: poll.question,
        created_at: poll.created_at,
        expires_at: poll.expires_at,
      },
      options: poll.options.map((option: string, index: number) => ({
        text: option,
        votes: voteCounts[index],
        percentage: votePercentages[index]
      })),
      totalVotes,
    };

    return { data: results, error: null, status: 200 };
  } catch (error) {
    console.error('Unexpected error fetching poll results:', error);
    return { 
      data: null, 
      error: 'An unexpected error occurred while fetching poll results.', 
      status: 500 
    };
  }
}