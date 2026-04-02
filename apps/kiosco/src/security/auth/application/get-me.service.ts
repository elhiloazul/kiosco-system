import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IAdminRepository, ADMIN_REPOSITORY } from '../domain/admin.repository';
import { AdminOutputDto } from './auth.dto';

@Injectable()
export class GetMeService {
  constructor(
    @Inject(ADMIN_REPOSITORY)
    private readonly adminRepository: IAdminRepository,
  ) {}

  async execute(adminId: string): Promise<AdminOutputDto> {
    const admin = await this.adminRepository.findById(adminId);
    if (!admin) {
      throw new NotFoundException('Not found');
    }

    return {
      id: admin.id,
      name: admin.name,
      email: admin.email.toString(),
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };
  }
}