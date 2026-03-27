import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Star,
  Eye,
  ShoppingCart,
  TrendUp,
  Calendar,
  Tag,
  CurrencyInr,
  Percent,
  Image as ImageIcon,
} from "@phosphor-icons/react";
import { useAdminProductDetail } from "@/api/exports";
import { Button, VariantsSection, Pagination } from "@/components";
import { format } from "date-fns";
import { useState } from "react";

function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [sellerOfferingsPage, setSellerOfferingsPage] = useState(1);
  const [sellerOfferingsLimit, setSellerOfferingsLimit] = useState(10);

  const {
    data: productResponse,
    isLoading,
    error,
  } = useAdminProductDetail(id!, {
    sellerOfferingsPage,
    sellerOfferingsLimit,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !productResponse?.data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-slate-600 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/products")} variant="primary">
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const product = productResponse.data;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                icon={<ArrowLeft size={16} />}
                onClick={() => navigate("/products")}
              />
              <div className="h-6 w-px bg-slate-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {product.name}
                </h1>
                <p className="text-sm text-slate-500">
                  Product ID: {product.id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  product.status === "published"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {product.status === "published" ? "Published" : "Draft"}
              </span>
              {product.isFeatured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  <Star size={14} className="mr-1" weight="fill" />
                  Featured
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-2">
            {/* Product Images */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <ImageIcon size={20} className="text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Product Images
                </h2>
              </div>
              {product.images && product.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden border border-slate-200"
                    >
                      <img
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                  <div className="text-center">
                    <ImageIcon
                      size={48}
                      className="text-slate-400 mx-auto mb-2"
                    />
                    <p className="text-slate-500">No images available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Product Description */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Description
              </h2>
              {product.description ? (
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              ) : (
                <p className="text-slate-500 italic">No description provided</p>
              )}
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-2">
            {/* Pricing Card */}
            {/* <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <CurrencyInr size={20} className="text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Pricing
                </h2>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Base Price</span>
                  <span className="text-lg font-bold text-slate-900">
                    ₹{product.price?.toLocaleString()}
                  </span>
                </div>
                {product.discountedPrice && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">
                        Discounted Price
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        ₹{product.discountedPrice?.toLocaleString()}
                      </span>
                    </div>
                    {product.discountedPercent && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Discount</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {product.discountedPercent.toFixed(1)}% off
                        </span>
                      </div>
                    )}
                  </>
                )}
                {product.gst_rate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">GST Rate</span>
                    <span className="text-sm text-slate-900">
                      {product.gst_rate}%
                    </span>
                  </div>
                )}
              </div>
            </div> */}

            {/* Statistics Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendUp size={20} className="text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Statistics
                </h2>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye size={16} className="text-slate-400" />
                    <span className="text-sm text-slate-600">Views</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {product.views?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={16} className="text-slate-400" />
                    <span className="text-sm text-slate-600">Orders</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {product.orders?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-slate-400" />
                    <span className="text-sm text-slate-600">Rating</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {product.rating?.toFixed(1) || "0.0"}
                  </span>
                </div>
              </div>
            </div>

            {/* Timestamps Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calendar size={20} className="text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Timeline
                </h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Created
                    </p>
                    <p className="text-xs text-slate-500">
                      {format(new Date(product.createdAt), "PPP p")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Last Updated
                    </p>
                    <p className="text-xs text-slate-500">
                      {format(new Date(product.updatedAt), "PPP p")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                  icon={<Tag size={16} />}
                  onClick={() => navigate(`/products/${id}/edit`)}
                >
                  Edit Product
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                  icon={<Eye size={16} />}
                >
                  View in Store
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                  icon={<ShoppingCart size={16} />}
                >
                  View Analytics
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width: Specifications */}
        <div className="space-y-4 mt-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-600">Category</span>
                <span className="text-sm text-slate-900">{product.categoryName || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-600">Stock Level</span>
                <span className="text-sm text-slate-900">{product.stock} KG</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-600">Rating</span>
                <div className="flex items-center gap-1">
                  <Star size={16} weight="fill" className="text-amber-400" />
                  <span className="text-sm text-slate-900">{product.rating?.toFixed(1) || "0.0"}</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-600">Reviews</span>
                <span className="text-sm text-slate-900">{product.reviews || 0}</span>
              </div>
            </div>
          </div>

          {/* Full Width: Product Variants */}
          <VariantsSection
            variants={product.variants}
            variantsCount={product.variantsCount || 0}
          />

          {/* Full Width: Seller Offerings */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <ShoppingCart size={20} className="text-slate-600" />
              <h2 className="text-lg font-semibold text-slate-900">
                Seller Offerings
              </h2>
              <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                {product.sellerOfferingsPagination?.total || 0} sellers
              </span>
            </div>

            {product.sellerOfferings && product.sellerOfferings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">
                        Seller
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">
                        Contact
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-700">
                        Price
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-700">
                        Available Stock
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-700">
                        Total Stock
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.sellerOfferings.map((offering, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-slate-900">
                              {offering.sellerBusinessName}
                            </div>
                            <div className="text-sm text-slate-600">
                              {offering.sellerOwnerName}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <div className="text-slate-700">
                              {offering.sellerOwnerEmail}
                            </div>
                            <div className="text-slate-500">
                              {offering.sellerBusinessPhone}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="font-semibold text-slate-900">
                            ₹{offering.sellerPrice?.toLocaleString()}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              offering.availableStock > 10
                                ? "bg-green-100 text-green-800"
                                : offering.availableStock > 0
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {offering.availableStock}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="text-slate-700">
                            {offering.totalStock}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {product?.sellerOfferingsPagination && product?.sellerOfferingsPagination?.totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination
                      page={product.sellerOfferingsPagination.page}
                      limit={product.sellerOfferingsPagination.limit}
                      total={product.sellerOfferingsPagination.total}
                      onPageChange={setSellerOfferingsPage}
                      onLimitChange={setSellerOfferingsLimit}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart
                  size={48}
                  className="text-slate-400 mx-auto mb-4"
                />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No Seller Offerings
                </h3>
                <p className="text-slate-500">
                  This product is not currently offered by any sellers.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
