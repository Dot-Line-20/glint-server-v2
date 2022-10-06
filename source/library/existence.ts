import prisma from '@library/prisma'

export async function isUserExist(id: number): Promise<boolean> {
  return (
    (await prisma.user.findFirst({
      where: {
        id: id,
        verificationKey: null,
      },
    })) !== null
  )
}

export async function isScheduleExist(id: number): Promise<boolean> {
  return (
    (await prisma.schedule.findUnique({
      where: {
        id: id,
      },
    })) !== null
  )
}
