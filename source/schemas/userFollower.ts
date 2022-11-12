import { Schema } from '@library/type'
import { UserFollower } from '@prisma/client'
import userSchema from '@schemas/user'

export default {
  userId: userSchema.id,
  followingUserId: userSchema.id,
} as Schema<keyof UserFollower>
