import { apiMethods } from '../../index';
import { ADMIN_TOOLS_BARCODE, ADMIN_TOOLS_QR_CODE } from './endpoints';
import { GenerateCodeRequest, GenerateCodeResponse } from './types';

export const adminToolsApi = {
  generateQrCode: async (data: GenerateCodeRequest): Promise<GenerateCodeResponse> => {
    const response = await apiMethods.post<GenerateCodeResponse>(ADMIN_TOOLS_QR_CODE, data);
    return response.data;
  },
  generateBarcode: async (data: GenerateCodeRequest): Promise<GenerateCodeResponse> => {
    const response = await apiMethods.post<GenerateCodeResponse>(ADMIN_TOOLS_BARCODE, data);
    return response.data;
  },
};
