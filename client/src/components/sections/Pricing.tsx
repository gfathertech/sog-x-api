import Layout from '../Layout';

function Pricing() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">PRICING PLANS</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-center">Free Tier</h2>
          <p className="text-4xl font-bold text-center mb-6">$0<span className="text-lg">/month</span></p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>100 requests/day</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Basic APIs access</span>
            </li>
            <li className="flex items-center text-gray-500">
              <span className="text-gray-500 mr-2">✗</span>
              <span>Priority support</span>
            </li>
            <li className="flex items-center text-gray-500">
              <span className="text-gray-500 mr-2">✗</span>
              <span>Advanced features</span>
            </li>
          </ul>
          <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors">
            Current Plan
          </button>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg border border-blue-500 relative">
          <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg">
            Popular
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center">Pro Plan</h2>
          <p className="text-4xl font-bold text-center mb-6">$29<span className="text-lg">/month</span></p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>5,000 requests/day</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>All APIs access</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Priority support</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Advanced features</span>
            </li>
          </ul>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
            Upgrade Now
          </button>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-center">Enterprise</h2>
          <p className="text-4xl font-bold text-center mb-6">Custom</p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Unlimited requests</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>All APIs access</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>24/7 Dedicated support</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Custom API development</span>
            </li>
          </ul>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors">
            Contact Sales
          </button>
        </div>
      </div>
      
      <div className="mt-12 bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Can I change plans later?</h3>
            <p className="text-gray-300">Yes, you can upgrade or downgrade your plan at any time. Your billing will be prorated accordingly.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-300">We accept all major credit cards including Visa, Mastercard, and American Express. Enterprise plans can also be paid via invoice.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Is there a free trial?</h3>
            <p className="text-gray-300">Yes, we offer a 14-day free trial for our Pro plan with no credit card required.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PricingPage() {
  return (
    <Layout>
      <Pricing />
    </Layout>
  );
}