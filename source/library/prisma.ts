import { PrismaClient } from '@prisma/client'

export const prisma: PrismaClient = new PrismaClient()

export async function isUserIdExists(id: number): Promise<boolean> {
  return (
    (await prisma.user.count({
      where: {
        id: id,
        verificationKey: null,
      },
    })) === 1
  )
}

export async function isUserEmailExists(email: string): Promise<boolean> {
  return (
    (await prisma.user.count({
      where: {
        email: email,
      },
    })) === 1
  )
}

export async function isScheduleExists(
  userId: number,
  id: number
): Promise<boolean> {
  return (
    (await prisma.schedule.count({
      where: {
        id: id,
        userId: userId,
      },
    })) === 1
  )
}

export async function isPostExists(id: number): Promise<boolean> {
  return (
    (await prisma.post.count({
      where: {
        id: id,
        isDeleted: false,
      },
    })) === 1
  )
}

export async function isMediaExists(id: number): Promise<boolean> {
  return (
    (await prisma.media.count({
      where: {
        id: id,
      },
    })) === 1
  )
}

export async function isCategoryExists(id: number): Promise<boolean> {
  return (
    (await prisma.category.count({
      where: {
        id: id,
      },
    })) === 1
  )
}

export async function isChatExists(id: number): Promise<boolean> {
  return (
    (await prisma.chat.count({
      where: {
        id: id,
      },
    })) === 1
  )
}

export async function isStoryExists(id: number): Promise<boolean> {
  return (
    (await prisma.story.count({
      where: {
        id: id,
        isDeleted: false,
      },
    })) === 1
  )
}
