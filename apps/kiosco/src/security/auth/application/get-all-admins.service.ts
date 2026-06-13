import { Inject, Injectable } from '@nestjs/common';
import { IAdminRepository, ADMIN_REPOSITORY } from '../domain/admin.repository';
import { AdminListItemOutputDto } from './auth.dto';

@Injectable()
export class GetAllAdminsService {
  constructor(
    @Inject(ADMIN_REPOSITORY)
    private readonly adminRepository: IAdminRepository,
  ) {}

  async execute(): Promise<AdminListItemOutputDto[]> {
    const admins = await this.adminRepository.findAll();

    return admins.map((admin) => ({
      id: admin.id,
      name: admin.name,
      email: admin.email.toString(),
      status: admin.status,
      isPrincipal: admin.isPrincipal,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    }));
  }
}
