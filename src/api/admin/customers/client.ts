import { apiMethods } from '../../index';
import {
  ADMIN_CUSTOMERS_LIST,
  ADMIN_CUSTOMERS_GET,
  ADMIN_CUSTOMERS_CREATE,
  ADMIN_CUSTOMERS_UPDATE,
  ADMIN_CUSTOMERS_DELETE,
  ADMIN_CUSTOMERS_BAN,
  ADMIN_CUSTOMERS_UNBAN,
} from './endpoints';
import {
  AdminCustomer,
  AdminCustomersResponse,
  AdminCustomerResponse,
  AdminCustomersListParams,
  AdminCustomerCreateInput,
  AdminCustomerUpdateInput,
} from './types';

export const adminCustomersApi = {
  // Fetch customers list
  listCustomers: async (params?: AdminCustomersListParams): Promise<AdminCustomersResponse['data']> => {
    const response = await apiMethods.get<AdminCustomersResponse>(ADMIN_CUSTOMERS_LIST, params);
    return response.data?.data;
  },

  // Get single customer
  getCustomer: async (id: string): Promise<AdminCustomerResponse> => {
    const response = await apiMethods.get<AdminCustomerResponse>(ADMIN_CUSTOMERS_GET(id));
    return response.data;
  },

  // Create customer
  createCustomer: async (data: AdminCustomerCreateInput): Promise<AdminCustomerResponse> => {
    const response = await apiMethods.post<AdminCustomerResponse>(ADMIN_CUSTOMERS_CREATE, data);
    return response.data;
  },

  // Update customer
  updateCustomer: async (id: string, data: AdminCustomerUpdateInput): Promise<AdminCustomerResponse> => {
    const response = await apiMethods.put<AdminCustomerResponse>(ADMIN_CUSTOMERS_UPDATE(id), data);
    return response.data;
  },

  // Delete customer
  deleteCustomer: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiMethods.delete<{ success: boolean }>(ADMIN_CUSTOMERS_DELETE(id));
    return response.data;
  },

  // Ban customer
  banCustomer: async (id: string): Promise<AdminCustomerResponse> => {
    const response = await apiMethods.post<AdminCustomerResponse>(ADMIN_CUSTOMERS_BAN(id));
    return response.data;
  },

  // Unban customer
  unbanCustomer: async (id: string): Promise<AdminCustomerResponse> => {
    const response = await apiMethods.post<AdminCustomerResponse>(ADMIN_CUSTOMERS_UNBAN(id));
    return response.data;
  },
};
