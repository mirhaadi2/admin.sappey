import apiClient, { apiMethods } from '../../index';
import {
  DELHIVERY_PINCODE_CHECK,
  DELHIVERY_TRACK,
  DELHIVERY_SHIPMENT_EDIT,
  DELHIVERY_SHIPMENT_CANCEL,
  DELHIVERY_SHIPMENT_CREATE,
  DELHIVERY_EWAYBILL_UPDATE,
  DELHIVERY_CHARGES,
  DELHIVERY_PACKING_SLIP,
  DELHIVERY_PICKUP,
} from './endpoints';

export interface PincodeServiceabilityResponse {
  success: boolean;
  data: any;
}

export interface TrackingResponse {
  success: boolean;
  data: any;
}

export interface ShipmentEditResponse {
  success: boolean;
  data: any;
}

export interface ShipmentCancelResponse {
  success: boolean;
  data: any;
}

export interface ShipmentCreateResponse {
  success: boolean;
  data: any;
}

export interface EwaybillUpdateResponse {
  success: boolean;
  data: any;
}

export interface ChargesResponse {
  success: boolean;
  data: any;
}

export interface PackingSlipResponse {
  success: boolean;
  data: any | Blob;
}

export interface PickupResponse {
  success: boolean;
  data: any;
}

export const delhiveryApi = {
  checkPincodeServiceability: async (pincode: string): Promise<PincodeServiceabilityResponse> => {
    const response = await apiMethods.get<PincodeServiceabilityResponse>(DELHIVERY_PINCODE_CHECK(pincode));
    return response.data;
  },

  trackShipment: async (waybill: string): Promise<TrackingResponse> => {
    const response = await apiMethods.get<TrackingResponse>(DELHIVERY_TRACK(waybill));
    return response.data;
  },

  editShipment: async (data: any): Promise<ShipmentEditResponse> => {
    const response = await apiMethods.post<ShipmentEditResponse>(DELHIVERY_SHIPMENT_EDIT, data);
    return response.data;
  },

  cancelShipment: async (waybill: string): Promise<ShipmentCancelResponse> => {
    const response = await apiMethods.post<ShipmentCancelResponse>(DELHIVERY_SHIPMENT_CANCEL, { waybill });
    return response.data;
  },

  createShipment: async (data: any): Promise<ShipmentCreateResponse> => {
    const response = await apiMethods.post<ShipmentCreateResponse>(DELHIVERY_SHIPMENT_CREATE, data);
    return response.data;
  },

  updateEwaybill: async (waybill: string, data: any): Promise<EwaybillUpdateResponse> => {
    const response = await apiMethods.put<EwaybillUpdateResponse>(DELHIVERY_EWAYBILL_UPDATE(waybill), data);
    return response.data;
  },

  calculateCharges: async (params: any): Promise<ChargesResponse> => {
    const response = await apiMethods.get<ChargesResponse>(DELHIVERY_CHARGES, params);
    return response.data;
  },

  generatePackingSlip: async (params: any): Promise<any> => {
    if (params?.pdf) {
      const response = await apiClient.get<Blob>(DELHIVERY_PACKING_SLIP, {
        params,
        responseType: 'blob',
      });
      return response.data;
    }

    const response = await apiMethods.get<PackingSlipResponse>(DELHIVERY_PACKING_SLIP, params);
    return response.data;
  },

  createPickupRequest: async (data: any): Promise<PickupResponse> => {
    const response = await apiMethods.post<PickupResponse>(DELHIVERY_PICKUP, data);
    return response.data;
  },
};