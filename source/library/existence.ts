import prisma from '@library/prisma'

export async function isUserIdExist(id: number): Promise<boolean> {
  return (
    (await prisma.user.findFirst({
      where: {
        id: id,
        verificationKey: null,
      },
    })) !== null
  )
}

export async function isUserEmailExist(email: string): Promise<boolean> {
  return (
    (await prisma.user.findFirst({
      where: {
        email: email,
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
