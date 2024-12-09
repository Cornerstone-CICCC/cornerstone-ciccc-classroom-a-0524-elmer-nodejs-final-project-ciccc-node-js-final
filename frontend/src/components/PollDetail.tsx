

import React, { useEffect, useState } from "react";
import '../styles/poll.css'
import io from "socket.io-client";

const socket = io("http://localhost:3001", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

interface PollOption {
  text: string;
  votes: number;
}

interface Poll {
  _id: string;
  question: string;
  description: string;
  options: PollOption[];
}

const PollPage: React.FC<{ pollId: string }> = ({ pollId }) => {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    socket.emit("joinPoll", pollId);

    socket.on("pollData", (pollData: Poll) => {
      setPoll(pollData);
      setError(null);
    });

    socket.on("error", (err: { message: string }) => {
      setError(err.message);
    });

    socket.on("voteUpdate", (updatedPoll: Poll) => {
      setPoll(updatedPoll);
    });

    return () => {
      socket.off("pollData");
      socket.off("error");
      socket.off("voteUpdate");
      socket.disconnect();
    };
  }, [pollId]);

  const handleVote = (optionIndex: number) => {
    socket.emit("vote", { pollId, optionIndex });
  };


  const totalVotes = poll ? poll.options.reduce((sum, option) => sum + option.votes, 0) : 0;

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!poll) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="poll-container">
      <div className="inner-container">
        <h1>{poll.question}</h1>
        <p>{poll.description}</p>
        <div className="poll-options">
        {poll.options.map((option, index) => {
          const percentage = totalVotes > 0 
            ? Math.round((option.votes / totalVotes) * 100) 
            : 0;
          
          return (
            <div key={index} className="poll-option"
            >
              <span className="option-text">{option.text}</span>
              <div className="vote-bar-container"
              onClick={() => handleVote(index)} 
              >
                <div 
                  className="vote-bar" 
                  style={{ 
                    width: `${percentage}%`, 
                    backgroundColor: `hsl(${240 - (index * 40)}, 70%, 60%)` 
                  }}
                >
                </div>
              </div>
              <span className="option-votes">{option.votes} votes ({percentage}%)</span>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
};

export default PollPage;
