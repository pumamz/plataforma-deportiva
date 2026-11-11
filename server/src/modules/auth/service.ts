import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../../core/config.js';
import type { AuthPayload } from '../../core/http.js';
import { Tenant, User } from '../../models.js';

export class AuthService {
  async login(input: { username: string; password: string; tenant: string }) {
    const organization = await Tenant.findOne({ where: { slug: input.tenant } });
    if (!organization) return null;
    const user = await User.findOne({ where: { tenantId: organization.id, username: input.username } });
    if (!user || !bcrypt.compareSync(input.password, user.password)) return null;
    const payload: AuthPayload = { id: user.id, tenantId: organization.id, role: user.role, username: user.username };
    return { token: jwt.sign(payload, config.JWT_SECRET, { expiresIn: '12h' }), user: { ...payload, displayName: user.displayName }, tenant: organization };
  }

  async session(auth: AuthPayload) {
    const [tenant, user] = await Promise.all([
      Tenant.findByPk(auth.tenantId),
      User.findByPk(auth.id, { attributes: { exclude: ['password'] } }),
    ]);
    return { tenant, user };
  }
}
