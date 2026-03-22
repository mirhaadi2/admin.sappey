import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
        }
        catch (err) {
            setError('Failed to save settings');
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Platform Settings" }), saved && (_jsxs("div", { className: "flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700", children: [_jsx(AlertCircle, { size: 20 }), _jsx("p", { children: "Settings saved successfully!" })] })), error && (_jsxs("div", { className: "flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700", children: [_jsx(AlertCircle, { size: 20 }), _jsx("p", { children: error })] })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "General Settings" }), _jsx("div", { className: "space-y-4", children: _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Platform Name" }), _jsx("input", { type: "text", value: platformName, onChange: (e) => setPlatformName(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" })] }) })] }), _jsx("hr", { className: "my-4" }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Commission Settings" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Platform Commission on Orders (%)" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("input", { type: "number", min: "0", max: "100", step: "0.5", value: commission, onChange: (e) => setCommission(parseFloat(e.target.value)), className: "flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsxs("span", { className: "text-sm text-gray-600", children: ["Current: ", commission, "%"] })] }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Applied to all seller orders on the platform" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Minimum Order Value (\u20B9)" }), _jsx("input", { type: "number", min: "0", step: "10", value: minOrderValue, onChange: (e) => setMinOrderValue(parseFloat(e.target.value)), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Orders below this value will not be allowed" })] })] })] }), _jsx("hr", { className: "my-4" }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Refund Policy" }), _jsx("div", { className: "space-y-4", children: _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Maximum Refund Window (Days)" }), _jsx("input", { type: "number", min: "0", step: "1", value: maxRefundDays, onChange: (e) => setMaxRefundDays(parseInt(e.target.value)), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Users can request refunds within this many days of purchase" })] }) })] }), _jsx("hr", { className: "my-4" }), _jsxs("div", { className: "flex gap-4", children: [_jsxs("button", { onClick: handleSave, className: "flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium", children: [_jsx(Save, { size: 20 }), "Save Settings"] }), _jsx("button", { className: "px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium", children: "Reset" })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-blue-50 p-6 rounded-lg border border-blue-200", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-3", children: "Commission Info" }), _jsxs("p", { className: "text-sm text-gray-700 mb-4", children: ["The current platform commission is ", _jsxs("strong", { children: [commission, "%"] }), " on all orders."] }), _jsx("p", { className: "text-xs text-gray-600", children: "This amount is deducted from seller earnings and goes to the platform." })] }), _jsxs("div", { className: "bg-green-50 p-6 rounded-lg border border-green-200", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-3", children: "Seller Benefits" }), _jsxs("ul", { className: "text-sm text-gray-700 space-y-2", children: [_jsx("li", { children: "\u2713 Reach millions of customers" }), _jsx("li", { children: "\u2713 Secure payment processing" }), _jsx("li", { children: "\u2713 Automated order management" }), _jsx("li", { children: "\u2713 24/7 seller support" })] })] }), _jsxs("div", { className: "bg-purple-50 p-6 rounded-lg border border-purple-200", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-3", children: "Payment Terms" }), _jsx("p", { className: "text-sm text-gray-700", children: "Sellers receive payouts weekly. Refunds and chargebacks are handled within 48 hours." })] })] })] })] }));
}
export default SettingsPage;
