import ormConfig from '#database/orm.config';
import { UserEntity } from '#modules/user/entities/user.entity';
import * as bcrypt from 'bcryptjs';

async function seed() {
  const dataSource = await ormConfig.initialize();

  const userRepository = dataSource.getRepository(UserEntity);

  const existing = await userRepository.findOne({
    where: { email: 'admin@example.com' },
  });

  if (existing) {
    console.log('User already exists. Skipping seed.');
    await dataSource.destroy();
    return;
  }

  const password = await bcrypt.hash('admin123', 10);

  const user = userRepository.create({
    email: 'admin@example.com',
    password,
    fullName: 'Admin User',
    isActive: true,
    mobile: '0899999999',
  });

  await userRepository.save(user);
  console.log('✅ Seeded user: admin@example.com');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Failed to run seed:', err);
});
