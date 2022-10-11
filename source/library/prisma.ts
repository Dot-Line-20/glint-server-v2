import { PrismaClient } from '@prisma/client'

export const prisma: PrismaClient = new PrismaClient()

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

export async function isScheduleExists(
  userId: number,
  id: number
): Promise<boolean> {
  return (
    (await prisma.schedule.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    })) !== null
  )
}

export async function isPostExists(id: number): Promise<boolean> {
  return (
    (await prisma.post.findFirst({
      where: {
        id: id,
        isDeleted: false,
      },
    })) !== null
  )
}

export async function isCommentExists(
  postId: number,
  id: number
): Promise<boolean> {
  return (
    (await prisma.comment.findFirst({
      where: {
        id: id,
        post: {
          id: postId,
          isDeleted: false,
        },
        isDeleted: false,
      },
    })) !== null
  )
}
