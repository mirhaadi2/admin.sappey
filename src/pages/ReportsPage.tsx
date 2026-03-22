function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Report</h2>
          <div className="text-center py-8 text-gray-500">
            <p>Chart coming soon...</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h2>
          <div className="text-center py-8 text-gray-500">
            <p>Chart coming soon...</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 md:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Transaction Report</h2>
          <div className="text-center py-8 text-gray-500">
            <p>Table coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;
