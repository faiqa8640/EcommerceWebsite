import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Address, AddressPayload } from "../types";
import {
  getAddressesAPI,
  addAddressAPI,
  updateAddressAPI,
  deleteAddressAPI,
  setDefaultAddressAPI,
} from "../data/apiService";
import { useAuth } from "./AuthContext";

interface AddressContextType {
  addresses: Address[];
  defaultAddress: Address | null;
  isLoading: boolean;
  refreshAddresses: () => Promise<void>;
  addAddress: (payload: AddressPayload) => Promise<Address | null>;
  updateAddress: (id: string, payload: Partial<AddressPayload>) => Promise<Address | null>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const refreshAddresses = useCallback(async () => {
    if (!user) {
      setAddresses([]);
      return;
    }
    setIsLoading(true);
    try {
      const fetched = await getAddressesAPI();
      setAddresses(fetched);
    } catch (err) {
      console.error("AddressContext: failed to refresh addresses", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Fetch addresses when user logs in / changes
  useEffect(() => {
    refreshAddresses();
  }, [refreshAddresses]);

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0] || null;

  const addAddress = async (payload: AddressPayload): Promise<Address | null> => {
    try {
      const res = await addAddressAPI(payload);
      if (res.success && res.data) {
        await refreshAddresses();
        return res.data;
      }
      // some controllers return address directly
      if (res.success && (res as any).address) {
        await refreshAddresses();
        return (res as any).address;
      }
      return null;
    } catch (err) {
      console.error("AddressContext: failed to add address", err);
      return null;
    }
  };

  const updateAddress = async (id: string, payload: Partial<AddressPayload>): Promise<Address | null> => {
    try {
      const res = await updateAddressAPI(id, payload);
      if (res.success) {
        await refreshAddresses();
        return (res as any).address || null;
      }
      return null;
    } catch (err) {
      console.error("AddressContext: failed to update address", err);
      return null;
    }
  };

  const deleteAddress = async (id: string): Promise<void> => {
    // Optimistic removal
    setAddresses((prev) => prev.filter((a) => a._id !== id));
    try {
      await deleteAddressAPI(id);
      await refreshAddresses(); // sync in case of default promotion
    } catch (err) {
      console.error("AddressContext: failed to delete address", err);
      await refreshAddresses(); // rollback
    }
  };

  const setDefaultAddress = async (id: string): Promise<void> => {
    // Optimistic update
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a._id === id }))
    );
    try {
      await setDefaultAddressAPI(id);
    } catch (err) {
      console.error("AddressContext: failed to set default", err);
      await refreshAddresses();
    }
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        defaultAddress,
        isLoading,
        refreshAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddresses = () => {
  const context = useContext(AddressContext);
  if (!context) throw new Error("useAddresses must be used within an AddressProvider");
  return context;
};
