import { 
  Eye, 
  Users, 
  FileText, 
  TrendingUp,
  Mail,
  ExternalLink,
  Info
} from 'lucide-react';
import Layout from '../Layout';
// import { useAuth } from '../../context/authContext';


function Dashboard() {


  return ( <div className=''>
        <div className='relative flex-9 p-4'>
      <h1 className="text-3xl font-bold mb-8">DASHBOARD</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">TOTAL VISITORS</p>
              <p className="text-2xl font-bold">2,304</p>
              <p className="text-xs text-green-500 mt-1">↑ 12.4% from last month</p>
            </div>
            <div className="p-2 bg-blue-900/30 rounded-lg">
              <Eye className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-500 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">TOTAL USERS</p>
              <p className="text-2xl font-bold">47</p>
              <p className="text-xs text-green-500 mt-1">↑ 3.2% from last week</p>
            </div>
            <div className="p-2 bg-green-900/30 rounded-lg">
              <Users className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">TOTAL REQUESTS</p>
              <p className="text-2xl font-bold">1,660,393</p>
              <p className="text-xs text-red-500 mt-1">↓ 5.1% from yesterday</p>
            </div>
            <div className="p-2 bg-purple-900/30 rounded-lg">
              <FileText className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-yellow-500 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">REQUESTS TODAY</p>
              <p className="text-2xl font-bold">656</p>
              <p className="text-xs text-green-500 mt-1">↑ 8.7% from yesterday</p>
            </div>
            <div className="p-2 bg-yellow-900/30 rounded-lg">
              <TrendingUp className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Terms and Conditions */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FileText className="mr-2 w-5 h-5 text-blue-400" />
            TERMS AND CONDITIONS
          </h2>
          <div className="space-y-3 text-sm text-gray-300 max-h-80 overflow-y-auto pr-2">
            {[1, 2, 3, 4, 5, 6].map(item => (
              <div key={item} className="flex items-start">
                <span className="text-blue-400 font-bold mr-2">{item}.</span>
                <p className="flex-1">
                  {item === 1 && "Your Use Of The API Is Subject To Your Acceptance Of These Terms."}
                  {item === 2 && "Creating Multiple Accounts On The Same IP Address Will Result In Banning Of That IP And Account."}
                  {item === 3 && "Sharing Your API Key Is Strictly Prohibited. If Your API Key Is Found To Be Shared Or Misused, It Will Result In Banning Of Your Account."}
                  {item === 4 && "You Are Responsible For Any Activity That Occurs Under Your API Key Or Account."}
                  {item === 5 && "We Reserve The Right To Terminate Or Suspend Your Access To The API For Any Illegal Activity Without Prior Notice Or Liability."}
                  {item === 6 && "We Welcome Your Feedback On The API. Please Report Any Issues Or Suggestions For Improvement To Our Support Team."}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Us and Lines of the Day */}
        <div className="space-y-6">
          {/* Contact Us */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Mail className="mr-2 w-5 h-5 text-green-400" />
              CONTACT US
            </h2>
            <p className="text-sm text-gray-300 mb-4">
              Interested in buying PRO or VIP plan? Facing Issues? Want a Custom Plan?
            </p>
            <div className="flex flex-wrap gap-3">
              <a 
                href="#" 
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Support
              </a>
              <a 
                href="#" 
                // target="_blank"
                // rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Pricing
              </a>
            </div>
          </div>

          {/* Lines of the Day */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Info className="mr-2 w-5 h-5 text-yellow-400" />
              LINES OF THE DAY
            </h2>
            <div className="space-y-4 text-sm text-gray-300">
              <div className="p-3 bg-gray-700/50 rounded-lg">
                <p className="font-semibold text-white mb-1 flex items-center">
                  <span className="text-yellow-400 mr-2">✦</span>
                  Quote of the Day:
                </p>
                <p className="italic pl-5">"Some people die at 25 and aren't buried until 75."</p>
              </div>
              <div className="p-3 bg-gray-700/50 rounded-lg">
                <p className="font-semibold text-white mb-1 flex items-center">
                  <span className="text-yellow-400 mr-2">✦</span>
                  Fact of the Day:
                </p>
                <p className="italic pl-5">"Common pesticides such as roach, termite and flea insecticide can be found in the bodies of majority of Americans"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}


