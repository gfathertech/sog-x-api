import React, { useState, useEffect } from 'react';

function getQueryParam(key: string): string | null {
  return new URLSearchParams(window.location.search).get(key);
}

const GeminiPlayground = () => {
  const [prompt, setPrompt] = useState('');
  const [apikey, setApiKey] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Auto-fetch when prompt & apikey are present in URL
  useEffect(() => {
    const queryPrompt = getQueryParam('prompt');
    const queryApiKey = getQueryParam('apikey');

    if (queryPrompt && queryApiKey) {
      setPrompt(queryPrompt);
      setApiKey(queryApiKey);
      autoFetch(queryPrompt, queryApiKey);
    }
  }, []);

  const autoFetch = async (promptValue: string, apikeyValue: string) => {
    setIsLoading(true);
    setError(null);
    setResponse('');
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/ai/gemini?apikey=${apikeyValue}&prompt=${promptValue}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!res.ok) throw new Error('API error occurred while processing the request.');

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
      setShowModal(true);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !apikey.trim()) {
      setError('Please enter both prompt and API key.');
      return;
    }
    await autoFetch(prompt, apikey);
  };

  return (
    <div className="gemini-container max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg relative">
      <h2 className="text-center text-3xl font-bold mb-8 text-gray-800">Gemini AI Playground</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-semibold">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask me anything..."
            rows={4}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">API Key</label>
          <textarea
            value={apikey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key"
            rows={2}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !prompt.trim() || !apikey.trim()}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {isLoading ? 'Thinking...' : 'Ask Gemini'}
        </button>
      </form>

      {/* Pop-up Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-2xl relative shadow-lg">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            {error ? (
              <div className="text-red-600 font-semibold">{error}</div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Gemini's Response</h3>
                <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto whitespace-pre-wrap text-sm max-h-[70vh]">
                  {response}
                </pre>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiPlayground;