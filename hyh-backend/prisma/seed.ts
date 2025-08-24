import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  // Categorías
  const hair = await prisma.category.upsert({
    where: { slug: 'cuidado-capilar' },
    update: {},
    create: { name: 'Cuidado capilar', slug: 'cuidado-capilar' },
  });
  const machines = await prisma.category.upsert({
    where: { slug: 'maquinas' },
    update: {},
    create: { name: 'Máquinas y herramientas', slug: 'maquinas' },
  });
  const clothing = await prisma.category.upsert({
    where: { slug: 'ropa' },
    update: {},
    create: { name: 'Ropa', slug: 'ropa' },
  });

  // Productos
  await prisma.product.upsert({
    where: { slug: 'pomada-mate-100ml' },
    update: {},
    create: {
      name: 'Pomada Mate 100ml',
      slug: 'pomada-mate-100ml',
      brand: 'HYH',
      categoryId: hair.id,
      description: 'Acabado mate, fijación fuerte.',
      variants: { create: [{ price: 39900, stock: 120, attributes: { volumen: '100ml', fijacion: 'Fuerte' } }] },
      images: { create: [{ url: '/img/p1.jpg', alt: 'Pomada Mate' }] },
    },
  });

  await prisma.product.upsert({
    where: { slug: 'wahl-magic-clip-cordless' },
    update: {},
    create: {
      name: 'Wahl Magic Clip Cordless',
      slug: 'wahl-magic-clip-cordless',
      brand: 'Wahl',
      categoryId: machines.id,
      description: 'Máquina profesional inalámbrica.',
      variants: { create: [{ price: 589900, stock: 8, attributes: { voltaje: '110V' } }] },
      images: { create: [{ url: '/img/m1.jpg', alt: 'Magic Clip' }] },
    },
  });

  await prisma.product.upsert({
    where: { slug: 'camiseta-hyh-logo' },
    update: {},
    create: {
      name: 'Camiseta HYH Logo',
      slug: 'camiseta-hyh-logo',
      brand: 'HYH',
      categoryId: clothing.id,
      description: 'Camiseta 100% algodón.',
      variants: {
        create: [
          { price: 69900, stock: 10, attributes: { talla: 'M', color: 'Negro' } },
          { price: 69900, stock: 5, attributes: { talla: 'L', color: 'Blanco' } },
        ],
      },
      images: { create: [{ url: '/img/ts1.jpg', alt: 'Camiseta HYH' }] },
    },
  });

  // Usuario admin
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME ?? 'Admin';

  if (adminEmail && adminPassword) {
    const hashed = await bcrypt.hash(adminPassword, 10);

    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { role: 'ADMIN', name: adminName, password: hashed },
      create: {
        email: adminEmail,
        password: hashed,
        name: adminName,
        role: 'ADMIN',
      },
    });

    console.log(`Admin user seeded: ${adminEmail}`);
  } else {
    console.warn('Admin user not seeded because ADMIN_EMAIL or ADMIN_PASSWORD is not set');
  }

  console.log('Seed OK');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });