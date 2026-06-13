import { ConflictException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createId } from '@paralleldrive/cuid2';
import { IAdminRepository, ADMIN_REPOSITORY } from '../domain/admin.repository';
import { Admin } from '../domain/admin.aggregate';
import { CreateAdminInputDto, AdminOutputDto } from './auth.dto';

@Injectable()
export class CreateAdminService {
  constructor(
    @Inject(ADMIN_REPOSITORY)
    private readonly adminRepository: IAdminRepository,
  ) {}

  async execute(input: CreateAdminInputDto): Promise<AdminOutputDto> {
    const existing = await this.adminRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('Ya existe un usuario con ese correo');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const admin = Admin.create({
      id: createId(),
      name: input.name,
      email: input.email,
      passwordHash,
    });

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
