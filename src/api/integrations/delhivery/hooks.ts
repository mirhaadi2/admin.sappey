import { useMutation } from '@tanstack/react-query';
import { delhiveryApi } from './client';

export const useDelhiveryApi = () => {
  const checkPincodeServiceability = useMutation({
    mutationFn: (pincode: string) => delhiveryApi.checkPincodeServiceability(pincode),
  });

  const trackShipment = useMutation({
    mutationFn: (waybill: string) => delhiveryApi.trackShipment(waybill),
  });

  const editShipment = useMutation({
    mutationFn: (data: any) => delhiveryApi.editShipment(data),
  });

  const cancelShipment = useMutation({
    mutationFn: (waybill: string) => delhiveryApi.cancelShipment(waybill),
  });

  const createShipment = useMutation({
    mutationFn: (data: any) => delhiveryApi.createShipment(data),
  });

  const updateEwaybill = useMutation({
    mutationFn: ({ waybill, data }: { waybill: string; data: any }) =>
      delhiveryApi.updateEwaybill(waybill, data),
  });

  const calculateCharges = useMutation({
    mutationFn: (params: any) => delhiveryApi.calculateCharges(params),
  });

  const generatePackingSlip = useMutation({
    mutationFn: (params: any) => delhiveryApi.generatePackingSlip(params),
  });

  const createPickupRequest = useMutation({
    mutationFn: (data: any) => delhiveryApi.createPickupRequest(data),
  });

  const isLoading = checkPincodeServiceability.isPending ||
    trackShipment.isPending ||
    editShipment.isPending ||
    cancelShipment.isPending ||
    createShipment.isPending ||
    updateEwaybill.isPending ||
    calculateCharges.isPending ||
    generatePackingSlip.isPending ||
    createPickupRequest.isPending;

  return {
    checkPincodeServiceability: checkPincodeServiceability.mutateAsync,
    trackShipment: trackShipment.mutateAsync,
    editShipment: editShipment.mutateAsync,
    cancelShipment: cancelShipment.mutateAsync,
    createShipment: createShipment.mutateAsync,
    updateEwaybill: updateEwaybill.mutateAsync,
    calculateCharges: calculateCharges.mutateAsync,
    generatePackingSlip: generatePackingSlip.mutateAsync,
    createPickupRequest: createPickupRequest.mutateAsync,
    isLoading,
  };
};