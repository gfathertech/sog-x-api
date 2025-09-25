import {  LayoutDashboard, DollarSign, Download, Brain,
  Search, RefreshCw, Newspaper,Eye,} from 'lucide-react';

// export const checkServiceStatus = async (id: string): Promise<{ status: string, message: string }> => {
//   try {
//     const response = await fetch(`/api/v1/${id}/status`);
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     return { status: 'down', message: 'Service unavailable' };
//   }
// };



export const pages = [
   {
    id: "/dashboard",
    icon: LayoutDashboard,
    color: 'blue',
    name: "Dashboard",
    endpoint: "/api/v1/dashboard",
  },
  {
    id: "/pricing",
    name: "Pricing",
    icon: DollarSign,
    color: "orange",
    endpoint: "/api/v1/pricing",
  },
  {
    id: "/downloader",
    name: "Downloader",
    icon: Download,
    color: "pink",
    endpoint: "/api/v1/downloader"
  },
  {
    id: "/ai",
    name: "AI",
    icon: Brain,
    color: "red",
    endpoint: "/api/v1/ai"
  },
  {
    id: "/searching",
    name: "Searching",
    icon: Search,
    color: "green",
    endpoint: "/api/v1/searching"
  },
  {
    id: "/converter",
    name: "Converter",
    icon: RefreshCw,
    color: "cyan",
    endpoint: "/api/v1/converter"
  },
  {
    id: "/news",
    name: "News",
    icon: Newspaper,
    color: "red",
    endpoint: "/api/v1/news"
  },
   {
    id: "/stalk",
    name: "Stalk",
    icon: Eye,
    color: "green",
    endpoint: "/api/v1/news"
  },
]

export interface AIService {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  status: 'active' | 'degraded' | 'down';
  statusMessage: string;
  parameters: {
    name: string;
    type: 'text' | 'number' | 'select' | 'url';
    options?: string[];
    placeholder?: string;
  }[];
}

export const getAIServices: AIService[] =
[
    {
      id: "/ai/gemini",
      name: "Gemini 1.5 Flash",
      description: "Google's fastest multimodal AI model",
      endpoint: "/api/v1/ai/gemini",
      status: "active",
      statusMessage: "Operational",
      parameters: [
        { 
          name: "prompt", 
          type: "text", 
          placeholder: "Enter your question or request..." 
        }
      ]
    },
  ]
export const getDownloaders: AIService[] =  [
    {
      id: "/d/apkmirror",
      name: "Apk Downloader",
      description: "This is for downloading Apk",
      endpoint: "/api/v1/d/apkmirror",
      status: "active",
      statusMessage: "Operational",
      parameters: [
        { 
          name: "text", 
          type: "text", 
          placeholder: "Enter the apk name..." 
        }
      ]
    },
    {
      id: "/d/yt",
      name: "Youtube Downloader",
      description: "This is for downloading youtube video",
      endpoint: "/api/v1/d/yt",
      status: "active",
      statusMessage: "Operational",
      parameters: [
        { 
          name: "url", 
          type: "url", 
          placeholder: "Enter the Youtube url..." 
        }
      ]
    },
     {
      id: "/d/tiktok",
      name: "Tiktok Downloader",
      description: "This is for downloading tiktok video",
      endpoint: "/api/v1/d/tiktok",
      status: "active",
      statusMessage: "Operational",
      parameters: [
        { 
          name: "url", 
          type: "url", 
          placeholder: "Enter the Tiktok url..." 
        }
      ]
    },
     {
      id: "/d/unsplash",
      name: "Unsplash Downloader",
      description: "This is for downloading unsplash images ",
      endpoint: "/api/v1/d/unsplash",
      status: "active",
      statusMessage: "Operational",
      parameters: [
        { 
          name: "text", 
          type: "text", 
          placeholder: "Search images..." 
        }
      ]
    },
  ];
export const getStalk: AIService[] =
[
    {
      id: "/stalk/ytstalk",
      name: "Yt stalk",
      description: "Youtube stalk",
      endpoint: "/api/v1/stalk/ytstalk",
      status: "down",
      statusMessage: "Operational",
      parameters: [
        { 
          name: "url", 
          type: "url", 
          placeholder: "Enter your url..." 
        }
      ]
    }
  ]
export const getSearch: AIService[] =
[
    {
      id: "/s/animex",
      name: "Animex search",
      description: "Animex search",
      endpoint: "/api/v1/s/animex",
      status: "active",
      statusMessage: "Operational",
      parameters: [
        { 
          name: "text", 
          type: "text", 
          placeholder: "Enter your search text..." 
        }
      ]
    },
     {
      id: "/s/animex/detail",
      name: "Animex search Details",
      description: "Animex Details",
      endpoint: "/api/v1/s/animex/detail",
      status: "active",
      statusMessage: "Operational",
      parameters: [
        { 
          name: "url", 
          type: "url", 
          placeholder: "Enter your search url..." 
        }
      ]
    },
  ]
export const urlShorten: AIService[] =
[
    {
      id: "/s/animex",
      name: "Animex search",
      description: "Animex search",
      endpoint: "/api/v1/s/animex",
      status: "active",
      statusMessage: "Operational",
      parameters: [
        { 
          name: "text", 
          type: "text", 
          placeholder: "Enter your search text..." 
        }
      ]
    },
    
  ]
  


  export interface APIResponse {
  status: number;
  owner: string;
  result: string | string[];
}

export interface ExecuteRequest {
  id: string;
  apikey: string;
  parameters: Record<string, string>;
}
export const executeService = async (request: ExecuteRequest): Promise<APIResponse> => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append('apikey', request.apikey);
    Object.entries(request.parameters).forEach(([key, value]) => {
      params.append(key, value);
    });
        // alert(params)

    
    const response = await fetch(`${request.id}?${params.toString()}`);
    return await response.json();
  } catch (error) {
    return {
      status: 500,
      owner: "Gfather Tech",
      result: "Network error: Failed to connect to API"
    };
  }
};
