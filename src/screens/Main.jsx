import React, { useEffect, useState } from 'react';
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // Use environment variable
});

const openai = new OpenAIApi(configuration);

function Main() {
  const [ans, setAns] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [day, setDay] = useState(0);

  const getAnswer = async () => {
    setLoading(true);

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}` // Use environment variable
      },
      body: JSON.stringify({
        'model': 'gpt-3.5-turbo',
        'messages': [{ role: "user", content: `Generate a ${day}-day itinerary for ${question}, including famous local food and places to visit.` }],
        'temperature': 0.2,
        'max_tokens': 4000,
        'top_p': 1,
        'frequency_penalty': 0,
        'presence_penalty': 0.5
      })
    };

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', requestOptions);
      const data = await response.json();
      setAns(data.choices[0]?.message?.content || "Error retrieving response");
    } catch (e) {
      console.error("Error fetching response:", e);
    }

    setLoading(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center' }}>
      <input style={{ width: 300, height: 50, borderRadius: 10, paddingLeft: 10 }}
        placeholder='Place' 
        onChange={(e) => setQuestion(e.target.value)} />
      
      <input style={{ width: 300, height: 50, borderRadius: 10, paddingLeft: 10, marginTop: 10 }}
        placeholder='Day' 
        onChange={(e) => setDay(e.target.value)} />
      
      <button style={{ marginTop: 10, width: 200 }} onClick={getAnswer}>Get Response</button>
      
      {loading ? <p>Loading...</p> : <p style={{ whiteSpace: 'pre-line', textAlign: 'left' }}>{ans}</p>}
    </div>
  );
}

export default Main;