import { Inject, Injectable, ForbiddenException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { IAdminRepository, ADMIN_REPOSITORY } from '../domain/admin.repository';
import { UpdateAdminInputDto, AdminListItemOutputDto } from './auth.dto';

@Injectable()
export class UpdateAdminService {
  constructor(
    @Inject(ADMIN_REPOSITORY)
    private readonly adminRepository: IAdminRepository,
  ) {}

  async execute(callerId: string, input: UpdateAdminInputDto): Promise<AdminListItemOutputDto> {
    if (input.status !== undefined) {
      const caller = await this.adminRepository.findById(callerId);
      if (!caller?.isPrincipal) {
        throw new ForbiddenException('Solo el usuario principal puede cambiar el estado de otros usuarios');
      }
    }

    const admin = await this.adminRepository.findById(input.id);
    if (!admin) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (input.status !== undefined) {
      if (admin.isPrincipal) {
        throw new UnprocessableEntityException('El usuario principal no puede ser desactivado');
      }
      admin.updateStatus(input.status);
    }

    await this.adminRepository.save(admin);

    return {
      id: admin.id,
      name: admin.name,
      email: admin.email.toString(),
      status: admin.status,
      isPrincipal: admin.isPrincipal,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };
  }
}
