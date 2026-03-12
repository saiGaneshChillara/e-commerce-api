import { Request, Response } from "express";
import { AddressService } from "../application/address.service";

export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  async create(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const address = await this.addressService.addAddress(userId, req.body);
      res.status(201).json(address);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const addresses = await this.addressService.listAddresses(userId);
      res.json(addresses);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const address = await this.addressService.updateAddress(userId, req.params.id as string, req.body);
      
      res.json(address);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      await this.addressService.deleteAddress(userId, req.params.id as string);

      res.json({ message: "Address deleted" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}