import { AddressRepository, CreateAddressInput, UpdateAddressInput } from "../domain/address.repository";

export class AddressService {
  constructor(private readonly addressRepository: AddressRepository) {}

  async addAddress(userId: string, data: CreateAddressInput) {
    if (data.isDefault) {
      await this.addressRepository.clearDefault(userId);
    }

    return this.addressRepository.create(userId, data);
  }

  async listAddresses(userId: string) {
    return this.addressRepository.findByUser(userId);
  }

  async updateAddress(userId: string, addressId: string, data: UpdateAddressInput) {
    if (data.isDefault) {
      await this.addressRepository.clearDefault(userId);
    }

    return this.addressRepository.update(addressId, userId, data);
  }
  }

  async deleteAddress(userId: string, addressId: string) {
    await this.addressRepository.delete(addressId, userId);
  }
}