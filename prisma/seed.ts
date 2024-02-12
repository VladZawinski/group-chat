import { AuthType, PrismaClient, Role, User } from "@prisma/client"

const prisma = new PrismaClient()
async function main() {
    console.log(`Start seeding ...`)
    const defaultUser = {
        username: 'guest@mailinator.com',
        name: 'Guest',
    }
    await prisma.user.create({
        data: defaultUser
    })
    console.log(`Finished seeding...`)
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