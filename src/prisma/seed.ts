import { PrismaClient, Usuarios } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()
const adminPassword = bcrypt.hashSync('admin', 10);
const adminUserData: Usuarios = {
    nombre: 'Admin',
    apellido: 'Admin',
    email: 'admin@mail.com',
    telefono: '1234567890',
    contrasena: adminPassword,
    rolId: 0,
    id: 0
};

async function main() {
  console.log(`Start seeding ...`);

  await prisma.roles.createMany({
    data: [
      { nombre: 'admin', descripcion: 'Administrador, cualquier operacion CRUD' },
      { nombre: 'user', descripcion: 'Usuario, operaciones CRUD limitadas' },
    ],
  });

  const adminRol = await prisma.roles.findFirst({where: { nombre: 'admin' }});
  if (!adminRol) {
    throw new Error('Admin role not found')
  }
  adminUserData.rolId = adminRol.id;
  const user = await prisma.usuarios.create({
    data: adminUserData,
  })
  console.log(`Created user with id: ${user.id}`)
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })