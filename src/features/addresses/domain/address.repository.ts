import { Address } from "./address.entity";

export interface CreateAddressInput {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface UpdateAddressInput {
  line1?: string;
  line2?: string | null;
  city?: string;
  state?: string | null;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}

export interface AddressRepository {
  create(userId: string, data: CreateAddressInput): Promise<Address>;

  findByUser(userId: string): Promise<Address[]>;

  findById(id: string): Promise<Address | null>;

  update(addressId: string, userId: string, data: UpdateAddressInput): Promise<Address>;

  delete(addressId: string, userId: string): Promise<void>;
  clearDefault(userId: string): Promise<void>;
}