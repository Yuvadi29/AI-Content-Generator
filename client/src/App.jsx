import { useEffect, useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import "./App.css";
import Markdown from 'react-markdown';

const makeRequestAPI = async (prompt) => {
  const res = await axios.post("http://localhost:8080/generate", { prompt });
  console.log(res.data);
  return res.data;
};

const App = () => {
  const [prompt, setPrompt] = useState("");
  const mutation = useMutation({
    mutationFn: makeRequestAPI,
    mutationKey: ["gemini-ai-request"],
  });

  const submitHandler = (e) => {
    e.preventDefault();
    mutation.mutate(prompt);
  };

  useEffect(() => {
    const API_KEY = 'AIzaSyBBwrEJTAcWIlkxJ87uO8UYynW6wBl0tKk';
    const CHANNEL_ID = 'UChVzP7gNOlkymoo000Y9_6Q';

    const fetchYouTubeVideos = async () => {
      try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            part: 'snippet',
            channelId: CHANNEL_ID,
            maxResults: 10,
            order: 'date',
            type: 'video',
            key: API_KEY,
          },
        });

        const videos = response.data.items;
        const video_titles = videos.map(item => item.snippet.title).join("\n");
        const prompt = `Here are some videos from my YouTube channel: ${video_titles}. Suggest some new video topics.`;
        setPrompt(prompt);

      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    }

    fetchYouTubeVideos();
  }, []);

  return (
    <div className="App">
      <div className="card">
        <h1 className="card-title">AI Content Generator</h1>
        <p>Enter a prompt and let AI craft unique content for you.</p>
        <form className="App-form" onSubmit={submitHandler}>
          <label htmlFor="prompt">Enter your prompt:</label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Write a content about..."
            className="App-input"
          />
          <button className="App-button" type="submit">
            Generate Content
          </button>
        </form>
        <section className="App-response">
          {mutation.isPending && <p>Generating your content...</p>}
          {mutation.isError && <p className="error">{mutation.error.message}</p>}
          {mutation.isSuccess && (
            <div className="card response-card">
              <Markdown className="markdown-content">{mutation.data}</Markdown>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
