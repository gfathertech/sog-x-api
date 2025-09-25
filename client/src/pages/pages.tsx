 import {useParams} from 'react-router-dom';
import DashboardPage from '../components/sections/Dashboard';
import { PricingPage } from '../components/sections/Pricing';
import AiPage from '../components/sections/Ai';
// import News from '../components/sections/News';
import DownloadPage from '../components/sections/Downloader';
// import StalkPage from '../components/sections/Stalk';
import SearchPage from '../components/sections/Search';
import NotFoundPage from './NotFoundPage';
 

 const Pages = () => {
  const { page } = useParams();

  switch (page) {
    case 'dashboard':
      return <DashboardPage />;
    case 'pricing':
      return <PricingPage />
     case 'ai':
      return <AiPage />;
     case 'searching':
      return <SearchPage />;
  //    case 'stalk':
  //     return <StalkPage />;
    case 'downloader':
  return <DownloadPage />;
  //    case 'news':
  //     return <News />;
    default:
      return <NotFoundPage/>
  }
};

export default Pages;