
export interface MediaItem {
  type: string;
  quality: string;
  extension: string;
  fileSize: string;
  downloadUrl: string;
}

export interface ApiResponse {
  service: string;
  title: string;
  imagePreviewUrl: string;  
  ytLink:string;
  streamLink: string;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
  description: string;
  items: MediaItem[];
}

export interface apkMirror {
  appLink: string;
  title: string;
  version: string;
}

export interface animeXin {
  title: string;
  url: string;
  image: string;
  episode: string;
  type: string;
}