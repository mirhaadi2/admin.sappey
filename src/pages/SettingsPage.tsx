import { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';

function SettingsPage() {
  const [platformName, setPlatformName] = useState('Sappey');
  const [commission, setCommission] = useState(10);
  const [minOrderValue, setMinOrderValue] = useState(1);
  const [maxRefundDays, setMaxRefundDays] = useState(30);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    try {
      // Validate inputs
      if (!platformName.trim()) {
        setError('Platform name is required');
        return;
      }
      if (commission < 0 || commission > 100) {
        setError('Commission must be between 0 and 100');
        return;
      }
      if (minOrderValue < 0) {
        setError('Minimum order value must be non-negative');
        return;
      }
      if (maxRefundDays < 0) {
        setError('Max refund days must be non-negative');
        return;
      }

      // Save settings (API call would go here)
      setSaved(true);
      setError('');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('Failed to save settings');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>

      {saved && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <AlertCircle size={20} />
          <p>Settings saved successfully!</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* General Settings */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <hr className="my-4" />

          {/* Commission Settings */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Commission Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform Commission on Orders (%)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={commission}
                    onChange={(e) => setCommission(parseFloat(e.target.value))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Current: {commission}%</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Applied to all seller orders on the platform
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Order Value (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Orders below this value will not be allowed
                </p>
              </div>
            </div>
          </div>

          <hr className="my-4" />

          {/* Refund Policy */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Refund Policy</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Refund Window (Days)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={maxRefundDays}
                  onChange={(e) => setMaxRefundDays(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Users can request refunds within this many days of purchase
                </p>
              </div>
            </div>
          </div>

          <hr className="my-4" />

          {/* Save Button */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Save size={20} />
              Save Settings
            </button>
            <button className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium">
              Reset
            </button>
          </div>
        </div>

        {/* Quick Info */}
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3">Commission Info</h3>
            <p className="text-sm text-gray-700 mb-4">
              The current platform commission is <strong>{commission}%</strong> on all orders.
            </p>
            <p className="text-xs text-gray-600">
              This amount is deducted from seller earnings and goes to the platform.
            </p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="font-semibold text-gray-900 mb-3">Seller Benefits</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>✓ Reach millions of customers</li>
              <li>✓ Secure payment processing</li>
              <li>✓ Automated order management</li>
              <li>✓ 24/7 seller support</li>
            </ul>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-gray-900 mb-3">Payment Terms</h3>
            <p className="text-sm text-gray-700">
              Sellers receive payouts weekly. Refunds and chargebacks are handled within 48 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
