import React, { useState, useEffect } from "react";

const TwitterFeed = ({ username }) => {
    const [tweets, setTweets] = useState([]);

    useEffect(() => {
        const fetchTweets = async () => {
            try {
                const response = await fetch(
                    `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&count=10`,
                    {
                        headers: {
                            Authorization:
                                "Bearer 1117845867942350849-IxZbFyxz423KfqVdGASSaN2Z4sNqgR",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch tweets");
                }

                const data = await response.json();
                setTweets(data);
            } catch (error) {
                console.error("Error fetching tweets:", error);
            }
        };

        fetchTweets();
    }, [username]);

    return (
        <div>
            <h2>Tweets de {username}</h2>
            <ul>
                {tweets.map((tweet) => (
                    <li key={tweet.id}>{tweet.text}</li>
                ))}
            </ul>
        </div>
    );
};

export default TwitterFeed;
