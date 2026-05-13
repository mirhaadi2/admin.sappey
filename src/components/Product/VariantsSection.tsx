import React, { useState } from 'react';
import {
  Package,
  Warning,
  CheckCircle,
  Minus,
  CurrencyInr,
  Cpu,
  Calendar,
  Clock,
} from '@phosphor-icons/react';
import { format } from 'date-fns';
import type { AdminProductVariantDetail, AdminProductSellerOffering } from '@/api/admin/products/types';

interface VariantsSectionProps {
  variants?: AdminProductVariantDetail[];
  variantsCount: number;
  stock?: number;
  sellerOfferings?: AdminProductSellerOffering[];
}

/**
 * Professional Variants Display Component
 * Enterprise-grade UI for managing and viewing product variants
 */
export function VariantsSection({ variants, variantsCount, stock, sellerOfferings }: VariantsSectionProps) {
  const [expandedVariant, setExpandedVariant] = useState<string | null>(null);

  if (variantsCount === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Package size={20} className="text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-900">Product Variants</h2>
        </div>
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <Warning size={20} className="text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-900">No variants available for this product</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Package size={20} className="text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-900">Product Variants</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {variantsCount} {variantsCount === 1 ? 'variant' : 'variants'}
          </span>
        </div>
      </div>

      {/* Mobile variant cards */}
      <div className="space-y-4 sm:hidden">
        {variants?.map((variant) => {
          const isExpanded = expandedVariant === variant.id;
          const hasStock = typeof stock === 'number' ? stock > 0 : sellerOfferings?.some((offering) => offering.availableStock > 0);
          return (
            <div key={variant.id} className="rounded-3xl border border-slate-200 bg-slate-50 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedVariant(isExpanded ? null : variant.id)}
                className="w-full p-4 text-left flex items-start justify-between gap-4"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 mb-2">
                    SKU
                  </p>
                  <p className="text-base font-bold text-slate-900">{variant.sku || 'N/A'}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm font-semibold text-slate-900">₹{variant.price?.toLocaleString()}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${hasStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {hasStock ? 'In Stock' : 'Sold Out'}
                  </span>
                </div>
              </button>
              {isExpanded && (
                <div className="border-t border-slate-200 bg-white p-4 space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="rounded-2xl border border-slate-200 p-3">
                      <p className="text-xs text-slate-500 uppercase tracking-[0.18em]">Sale Price</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{variant.discountedPrice ? `₹${variant.discountedPrice.toLocaleString()}` : 'N/A'}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-3">
                      <p className="text-xs text-slate-500 uppercase tracking-[0.18em]">Discount</p>
                      <p className="mt-1 text-sm font-semibold text-blue-600">{variant.discountedPercent ? `${variant.discountedPercent}%` : 'N/A'}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-3">
                      <p className="text-xs text-slate-500 uppercase tracking-[0.18em]">Weight</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{variant.weight ? `${variant.weight} ${variant.weightUnit || 'G'}` : 'N/A'}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-3">
                      <p className="text-xs text-slate-500 uppercase tracking-[0.18em]">Created</p>
                      <p className="mt-1 text-sm text-slate-700">{format(new Date(variant.createdAt), 'MMM dd, yyyy')}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-3">
                      <p className="text-xs text-slate-500 uppercase tracking-[0.18em]">Status</p>
                      <span className={`inline-flex items-center gap-1 mt-1 px-2 py-1 rounded-full text-xs font-semibold ${variant.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-700'}`}>
                        {variant.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-semibold text-slate-700">SKU</th>
              <th className="text-right py-3 px-4 font-semibold text-slate-700">Price</th>
              <th className="text-right py-3 px-4 font-semibold text-slate-700">Sale Price</th>
              <th className="text-right py-3 px-4 font-semibold text-slate-700">Discount %</th>
              <th className="text-right py-3 px-4 font-semibold text-slate-700">Weight</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-700">Status</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-700">Stock Status</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Created</th>
              <th className="text-center py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {variants?.map((variant) => {
              const isExpanded = expandedVariant === variant.id;
              const hasStock = typeof stock === 'number' ? stock > 0 : sellerOfferings?.some((offering) => offering.availableStock > 0);
              return (
                <React.Fragment key={variant.id}>
                  {/* Main Row */}
                  <tr
                    className="border-b border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() =>
                      setExpandedVariant(isExpanded ? null : variant.id)
                    }
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">
                          {variant.sku || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-semibold text-slate-900">
                        ₹{variant.price?.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-semibold text-green-600">
                        {variant.discountedPrice ? `₹${variant.discountedPrice.toLocaleString()}` : 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-semibold text-blue-600">
                        {variant.discountedPercent ? `${variant.discountedPercent}%` : 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-slate-600">
                        {variant.weight
                          ? `${variant.weight} ${variant?.weightUnit || 'G'}`
                          : 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        {variant.status === 'ACTIVE' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle size={12} weight="fill" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                            <Minus size={12} weight="fill" />
                            Inactive
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        {hasStock ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle size={12} weight="fill" />
                            In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <Warning size={12} weight="fill" />
                            Sold Out
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Calendar size={14} />
                        <span className="text-xs">
                          {format(new Date(variant.createdAt), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedVariant(isExpanded ? null : variant.id);
                        }}
                        className="p-1 hover:bg-slate-200 rounded transition-colors"
                      >
                        <Package size={16} className="text-slate-600" />
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <td colSpan={8} className="p-0">
                        <div className="px-4 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white rounded-lg p-3 border border-slate-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Cpu size={14} className="text-blue-600" />
                                <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                                  SKU
                                </span>
                              </div>
                              <p className="text-sm font-semibold text-slate-900">
                                {variant.sku || 'Not Set'}
                              </p>
                            </div>

                            <div className="bg-white rounded-lg p-3 border border-slate-200">
                              <div className="flex items-center gap-2 mb-2">
                                <CurrencyInr size={14} className="text-green-600" />
                                <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                                  Base Price
                                </span>
                              </div>
                              <p className="text-sm font-semibold text-slate-900">
                                ₹{variant.price?.toLocaleString()}
                              </p>
                            </div>

                            <div className="bg-white rounded-lg p-3 border border-slate-200">
                              <div className="flex items-center gap-2 mb-2">
                                <CurrencyInr size={14} className="text-red-600" />
                                <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                                  Sale Price
                                </span>
                              </div>
                              <p className="text-sm font-semibold text-red-600">
                                {variant.discountedPrice ? `₹${variant.discountedPrice.toLocaleString()}` : 'N/A'}
                              </p>
                            </div>

                            <div className="bg-white rounded-lg p-3 border border-slate-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Package size={14} className="text-blue-600" />
                                <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                                  Discount %
                                </span>
                              </div>
                              <p className="text-sm font-semibold text-blue-600">
                                {variant.discountedPercent ? `${variant.discountedPercent}%` : 'N/A'}
                              </p>
                            </div>

                            <div className="bg-white rounded-lg p-3 border border-slate-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Package size={14} className="text-purple-600" />
                                <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                                  Weight
                                </span>
                              </div>
                              <p className="text-sm font-semibold text-slate-900">
                                {variant.weight ? `${variant.weight} ${variant.weightUnit || 'G'}` : 'N/A'}
                              </p>
                            </div>

                            <div className="bg-white rounded-lg p-3 border border-slate-200">
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircle size={14} className="text-emerald-600" />
                                <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                                  Status
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {variant.status === 'ACTIVE' ? (
                                  <>
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm font-semibold text-green-700">
                                      Active
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                    <span className="text-sm font-semibold text-slate-600">
                                      Inactive
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="bg-white rounded-lg p-3 border border-slate-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Calendar size={14} className="text-slate-600" />
                                <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                                  Created
                                </span>
                              </div>
                              <p className="text-sm text-slate-700">
                                {format(
                                  new Date(variant.createdAt),
                                  'PPP p'
                                )}
                              </p>
                            </div>

                            <div className="bg-white rounded-lg p-3 border border-slate-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Clock size={14} className="text-slate-600" />
                                <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                                  Updated
                                </span>
                              </div>
                              <p className="text-sm text-slate-700">
                                {format(
                                  new Date(variant.updatedAt),
                                  'PPP p'
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Summary */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Package size={18} className="text-blue-600" />
            <div>
              <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                Total Variants
              </p>
              <p className="text-lg font-bold text-blue-900">{variantsCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle size={18} className="text-green-600" />
            <div>
              <p className="text-xs font-medium text-green-600 uppercase tracking-wide">
                Active
              </p>
              <p className="text-lg font-bold text-green-900">
                {variants?.filter((v) => v.status === 'ACTIVE').length || 0}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <Minus size={18} className="text-slate-600" />
            <div>
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                Inactive
              </p>
              <p className="text-lg font-bold text-slate-900">
                {variants?.filter((v) => v.status === 'INACTIVE').length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VariantsSection;
