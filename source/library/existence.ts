import prisma from './prisma'

export async function isUserIdExist(id: number): Promise<boolean> {
  return (
    (await prisma.user.findFirst({
      select: null,
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
      select: null,
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
      select: null,
      where: {
        id: id,
      },
    })) !== null
  )
}
