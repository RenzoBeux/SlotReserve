import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';

@Injectable()
export class UserService {
  private prisma = new PrismaClient();

  async findOrCreateUser(
    uid: string,
    email: string,
    name: string,
  ): Promise<User> {
    let user = await this.prisma.user.findUnique({ where: { id: uid } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          id: uid,
          email,
          name,
          slug: email.split('@')[0],
          role: 'USER',
          timezone: 'UTC',
        },
      });
    }
    return user;
  }

  async getMe(uid: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: uid } });
  }

  async updateMe(
    uid: string,
    data: Partial<Omit<User, 'id' | 'role'>>,
  ): Promise<User> {
    return this.prisma.user.update({ where: { id: uid }, data });
  }

  async getUserBySlug(slug: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { slug } });
  }
}
