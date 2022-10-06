import prisma from '@library/prisma'

export async function isUserExists(id: number): Promise<boolean> {
  return (
    (await prisma.user.findFirst({
      where: {
        id: id,
        verificationKey: null,
      },
    })) !== null
  )
}

export async function isScheduleExists(id: number): Promise<boolean> {
  return (
    (await prisma.schedule.findUnique({
      where: {
        id: id,
      },
    })) !== null
  )
}
