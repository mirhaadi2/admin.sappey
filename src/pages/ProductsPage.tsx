function ProductsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search products..."
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Categories</option>
        </select>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Product Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Seller</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Price</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Stock</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td colSpan={6} className="text-center py-8 text-gray-500">
                No products found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductsPage;
