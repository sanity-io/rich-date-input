import {formatInTimeZone, getTimezoneOffset, zonedTimeToUtc} from 'date-fns-tz'
import {type ReactNode, useCallback} from 'react'
import {DateTimeInput, FormPatch, InputProps, PatchEvent, set, unset} from 'sanity'

import {RichDate} from '../types'
import {getConstructedUTCDate, unlocalizeDateTime} from '../utils'

interface RelativeDateTimePickerProps extends Omit<InputProps, 'renderDefault'> {
  dateValue?: RichDate
}
export const RelativeDateTimePicker = (props: RelativeDateTimePickerProps): ReactNode => {
  const {dateValue: value, onChange} = props

  const handleDateChange = useCallback(
    (patch: FormPatch | PatchEvent | FormPatch[]) => {
      const timezone = value?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
      const newDatetime = (patch as unknown as {value: string})?.value
      if (!newDatetime || !('type' in patch) || patch.type !== 'set') {
        onChange(unset())
        return
      }

      /* get what time the user "meant" to set without tz info
       * right now, newDatetime is the time the user set plus
       * their current offset, not the timezone offset
       */
      const desiredDateTime = unlocalizeDateTime(
        newDatetime,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      )

      const newUtcDateObject = zonedTimeToUtc(desiredDateTime, timezone)
      // offset may have changed based on DST, capture that
      const newOffset = getTimezoneOffset(timezone, newUtcDateObject) / 60 / 1000
      const localDate = formatInTimeZone(newUtcDateObject, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX")

      const patches = []

      patches.push(set(newUtcDateObject.toISOString(), ['utc']))
      patches.push(set(localDate, ['local']))

      if (!value?.timezone) {
        patches.push(set(timezone, ['timezone']))
      }

      if (value?.offset !== newOffset) {
        patches.push(set(newOffset, ['offset']))
      }

      onChange(patches)
    },
    [onChange, value],
  )

  const dateToDisplay = value?.utc ? getConstructedUTCDate(value.utc, value.offset) : ''

  // @ts-expect-error -- slight mismatch in elementProps and renderDefault, but should line up in practice
  return <DateTimeInput {...props} onChange={handleDateChange} value={dateToDisplay} />
}
