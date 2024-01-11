import { getDeviceRepository } from "@/data-source";
import { Device } from "@/models";
import { DeepPartial, EntityMetadataNotFoundError, FindOptionsWhere } from "typeorm";


export class DevicesController {

  static async findOrCreate(where: FindOptionsWhere<Device> | FindOptionsWhere<Device>[], device?: DeepPartial<Device>) {

    const repo = await getDeviceRepository()
    const _device = repo.findOneBy(where)
    return _device || repo.create(device)
  }
}