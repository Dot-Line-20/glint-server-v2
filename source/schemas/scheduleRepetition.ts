import { Schema } from '@library/type'
import { ScheduleRepetition } from '@prisma/client'
import commonSchema from '@schemas/common'
import schedule from '@schemas/schedule'

export default {
  scheduleId: schedule.id,
  repeatingAt: commonSchema.dateTime,
} as Schema<keyof ScheduleRepetition>
