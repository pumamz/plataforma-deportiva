import { DataTypes, Model } from 'sequelize';
import { sequelize } from './database.js';

export type Role = 'PROVIDER_ADMIN' | 'ORG_ADMIN' | 'STAFF' | 'SCOREKEEPER';
export type Sport = 'FOOTBALL' | 'BASKETBALL' | 'VOLLEYBALL';

export class Tenant extends Model {
  declare id: string;
  declare name: string;
  declare slug: string;
  declare logoUrl: string | null;
  declare primaryColor: string;
  declare country: string;
  declare currency: string;
}

Tenant.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  logoUrl: { type: DataTypes.STRING, allowNull: true },
  primaryColor: { type: DataTypes.STRING(20), allowNull: false, defaultValue: '#5B5FFF' },
  country: { type: DataTypes.STRING(2), allowNull: false, defaultValue: 'EC' },
  currency: { type: DataTypes.STRING(3), allowNull: false, defaultValue: 'USD' },
}, { sequelize, modelName: 'Tenant' });

export class User extends Model {
  declare id: string;
  declare tenantId: string;
  declare username: string;
  declare password: string;
  declare displayName: string;
  declare role: Role;
}

User.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  username: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  displayName: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('PROVIDER_ADMIN', 'ORG_ADMIN', 'STAFF', 'SCOREKEEPER'), allowNull: false },
}, {
  sequelize,
  modelName: 'User',
  indexes: [{ unique: true, fields: ['tenantId', 'username'] }],
});

export class Athlete extends Model {}
Athlete.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  birthDate: { type: DataTypes.DATEONLY, allowNull: true },
  sport: { type: DataTypes.ENUM('FOOTBALL', 'BASKETBALL', 'VOLLEYBALL'), allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  teamName: { type: DataTypes.STRING, allowNull: true },
  guardianName: { type: DataTypes.STRING, allowNull: true },
  phone: { type: DataTypes.STRING, allowNull: true },
  status: { type: DataTypes.ENUM('ACTIVE', 'INACTIVE'), allowNull: false, defaultValue: 'ACTIVE' },
}, { sequelize, modelName: 'Athlete' });

export class Team extends Model {}
Team.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  sport: { type: DataTypes.ENUM('FOOTBALL', 'BASKETBALL', 'VOLLEYBALL'), allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  coach: { type: DataTypes.STRING, allowNull: true },
  playerCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  status: { type: DataTypes.ENUM('ACTIVE', 'INACTIVE'), allowNull: false, defaultValue: 'ACTIVE' },
}, { sequelize, modelName: 'Team' });

export class Venue extends Model {}
Venue.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  courtCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  sports: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  status: { type: DataTypes.ENUM('AVAILABLE', 'MAINTENANCE', 'CLOSED'), allowNull: false, defaultValue: 'AVAILABLE' },
}, { sequelize, modelName: 'Venue' });

export class Competition extends Model {}
Competition.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  sport: { type: DataTypes.ENUM('FOOTBALL', 'BASKETBALL', 'VOLLEYBALL'), allowNull: false },
  format: { type: DataTypes.ENUM('LEAGUE', 'GROUPS', 'KNOCKOUT'), allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  startDate: { type: DataTypes.DATEONLY, allowNull: false },
  endDate: { type: DataTypes.DATEONLY, allowNull: true },
  status: { type: DataTypes.ENUM('DRAFT', 'ACTIVE', 'FINISHED'), allowNull: false, defaultValue: 'DRAFT' },
}, { sequelize, modelName: 'Competition' });

export class Match extends Model {
  declare id: string;
  declare tenantId: string;
  declare homeTeam: string;
  declare awayTeam: string;
  declare homeScore: number;
  declare awayScore: number;
  declare sport: Sport;
  declare clockSeconds: number;
  declare status: 'SCHEDULED' | 'LIVE' | 'PAUSED' | 'FINISHED';
  declare period: string;
}

Match.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  competitionName: { type: DataTypes.STRING, allowNull: false },
  sport: { type: DataTypes.ENUM('FOOTBALL', 'BASKETBALL', 'VOLLEYBALL'), allowNull: false },
  homeTeam: { type: DataTypes.STRING, allowNull: false },
  awayTeam: { type: DataTypes.STRING, allowNull: false },
  homeScore: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  awayScore: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  scheduledAt: { type: DataTypes.DATE, allowNull: false },
  venue: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM('SCHEDULED', 'LIVE', 'PAUSED', 'FINISHED'), allowNull: false, defaultValue: 'SCHEDULED' },
  period: { type: DataTypes.STRING, allowNull: false, defaultValue: '1P' },
  clockSeconds: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, { sequelize, modelName: 'Match' });

export class Charge extends Model {}
Charge.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  athleteName: { type: DataTypes.STRING, allowNull: false },
  concept: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  dueDate: { type: DataTypes.DATEONLY, allowNull: false },
  status: { type: DataTypes.ENUM('PENDING', 'PARTIAL', 'PAID', 'OVERDUE'), allowNull: false, defaultValue: 'PENDING' },
  method: { type: DataTypes.ENUM('CASH', 'TRANSFER', 'OTHER'), allowNull: true },
  reference: { type: DataTypes.STRING, allowNull: true },
  paidAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
}, { sequelize, modelName: 'Charge' });

for (const model of [User, Athlete, Team, Venue, Competition, Match, Charge]) {
  model.belongsTo(Tenant, { foreignKey: { name: 'tenantId', allowNull: false }, onDelete: 'CASCADE' });
  Tenant.hasMany(model, { foreignKey: 'tenantId' });
}
