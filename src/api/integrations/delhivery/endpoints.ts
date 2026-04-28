// Delhivery API endpoints for admin
export const DELHIVERY_PINCODE_CHECK = (pincode: string) => `/delhivery/pincode/${pincode}`;
export const DELHIVERY_TRACK = (waybill: string) => `/delhivery/track/${waybill}`;
export const DELHIVERY_SHIPMENT_EDIT = '/delhivery/shipment/edit';
export const DELHIVERY_SHIPMENT_CANCEL = '/delhivery/shipment/cancel';
export const DELHIVERY_SHIPMENT_CREATE = '/admin/delhivery/shipment';
export const DELHIVERY_EWAYBILL_UPDATE = (waybill: string) => `/delhivery/ewaybill/${waybill}`;
export const DELHIVERY_CHARGES = '/delhivery/charges';
export const DELHIVERY_PACKING_SLIP = '/delhivery/packing-slip';
export const DELHIVERY_PICKUP = '/delhivery/pickup';