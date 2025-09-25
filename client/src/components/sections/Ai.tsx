import Layout from '../Layout';
import React, { useState, useEffect } from 'react';
import {
  getAIServices,
  executeService,
  AIService,
  APIResponse,
  ExecuteRequest,
} from '../../services/config';
import {
  PlayCircle, MessageSquare, Type, Hash, Search, X, ChevronsRight, Loader, KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/authContext';
const StatusIndicator: React.FC<{ status: AIService['status']; message: string }> = ({ status, message }) => (
  <div className="flex items-center">
    <span className={`h-3 w-3 rounded-full mr-2 shrink-0 ${status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
    <span className="hidden sm:inline">{message}</span>
  </div>
);

const ParamTag: React.FC<{ param: AIService['parameters'][0] }> = ({ param }) => {
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'text': return <MessageSquare size={14} className="mr-1.5" />;
      case 'number': return <Hash size={14} className="mr-1.5" />;
      default: return <Type size={14} className="mr-1.5" />;
    }
  };
  return (
    <span className="flex items-center bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 px-3 py-1 rounded-full text-sm font-medium">
      {getIcon(param.type)}
      {param.name}
    </span>
  );
};

// 3. The API Testing Pane (Now with real API call logic)
const ApiTestingPane: React.FC<{ service: AIService; onClose: () => void }> = ({ service, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<APIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTestSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setResponse(null);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const parameters: Record<string, string> = {};
    service.parameters.forEach(p => {
      parameters[p.name] = formData.get(p.name) as string;
    });

    const request: ExecuteRequest = {
      id: service.endpoint, // Use the endpoint from the service object
      apikey: formData.get('apikey') as string,
      parameters: parameters,
    };

    // Use your imported executeService function
    const apiResponse = await executeService(request);

    if (apiResponse.status >= 400) {
      setError(Array.isArray(apiResponse.result) ? apiResponse.result.join(', ') : apiResponse.result);
    } else {
      setResponse(apiResponse);
    }

    setIsLoading(false);
  };

      const {user} = useAuth();


  return (
    <tr className="bg-gray-100 dark:bg-gray-900">
      <td colSpan={5} className="p-0">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side: Input Form */}
          <div className="border-r-0 md:border-r border-gray-200 dark:border-gray-700 pr-0 md:pr-6">
            <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-4">Test: {service.name}</h3>
            <form onSubmit={handleTestSubmit}>
              {/* API Key Input */}
              <div className="mb-4">
                <label htmlFor="apikey" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <KeyRound size={14} className="mr-1" /> API Key
                </label>
                <input
                  type="password"
                  id="apikey"
                  name="apikey"
                  defaultValue={user?.apikey}
                  placeholder="Enter your API key"
                  required
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Dynamic Parameter Inputs */}
              {service.parameters.map(param => (
                <div key={param.name} className="mb-4">
                  <label htmlFor={param.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {param.name}
                  </label>
                  <input
                    type={param.type}
                    id={param.name}
                    name={param.name}
                    placeholder={param.placeholder || `Enter ${param.name}...`}
                    required
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              ))}
              <div className="flex items-center justify-between mt-6">
                <button type="submit" disabled={isLoading} className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400">
                  {isLoading ? <Loader size={18} className="animate-spin" /> : <ChevronsRight size={18} />}
                  {isLoading ? 'Testing...' : 'Run Test'}
                </button>
                <button type="button" onClick={onClose} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
                  <X size={18} /> Close
                </button>
              </div>
            </form>
          </div>

          {/* Right Side: Response Area */}
<div>
  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">API Response</h3>
  <div className="w-full h-64 bg-gray-900 dark:bg-black rounded-md p-4 font-mono text-sm overflow-auto">
    {isLoading && (
      <div className="flex items-center justify-center h-full text-gray-400">
        Waiting for response...
      </div>
    )}
    {error && (
      <pre className="text-red-400 whitespace-pre-wrap">Error: {error}</pre>
    )}
    {response && (
      <pre className="text-green-400 whitespace-pre-wrap break-words">
        {
          // split JSON into parts and wrap links
          JSON.stringify(response, null, 2)
            .split(/(https?:\/\/[^\s"]+)/g)
            .map((part, i) =>
              /^https?:\/\//.test(part) ? (
                <a
                  key={i}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline hover:text-blue-200 break-all"
                >
                  {part}
                </a>
              ) : (
                part
              )
            )
        }
      </pre>
    )}
    {!isLoading && !response && !error && (
      <div className="text-gray-500">
        Click "Run Test" to see the API output here.
      </div>
    )}
  </div>
</div>
        </div>
      </td>
    </tr>
  );
};

// --- Main AI Page Component ---
const Ai: React.FC = () => {
  const [tools, setTools] = useState<AIService[]>([]);
  const [filter, setFilter] = useState('');
  const [activeTestId, setActiveTestId] = useState<string | null>(null);


  useEffect(() => {
    setTools(getAIServices);
  }, []);

  const Services = tools.filter(tools =>
    tools.name.toLowerCase().includes(filter.toLowerCase())
  );

  const toggleTestButton  = (id: string) => {
    setActiveTestId(currentId => (currentId === id ? null : id));
  };

  return (
    <>
      <div className="page">
        <h1>
          Artificial Intelligence Services
        </h1>
        <p>
          Explore, test, and integrate our suite of AI capabilities.
        </p>

        <div className="searchbar">
          <Search className="search" size={20} />
          <input
            type="text"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Search for a service by name..."
          />
        </div>

        <div className="main">
          <table>
            <thead>
              <tr>
                {['No.', 'Feature Name', 'Status', 'Parameters', 'Action'].map(header => (
                  <th key={header}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Services.map((tool, index) => (
                <React.Fragment key={tool.id}>
                  <tr>
                    <td>{index + 1}</td>
                    <td className=" font-medium text-gray-900 dark:text-white">{tool.name}</td>
                    <td>
                      <StatusIndicator status={tool.status} message={tool.statusMessage} />
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        {tool.parameters.map(p => <ParamTag key={p.name} param={p} />)}
                      </div>
                    </td>
                    <td className="text-center">
                      <button onClick={() => toggleTestButton(tool.id)} className="action-button">
                        <PlayCircle size={18} />
                        Test
                      </button>
                    </td>
                  </tr>
                  {activeTestId === tool.id && <ApiTestingPane service={tool} onClose={() => setActiveTestId(null)} />}
                </React.Fragment>
              ))}
              {Services.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-gray-500">No services found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default function AiPage() {
  return (
    <Layout>
      <Ai />
    </Layout>
  );
}