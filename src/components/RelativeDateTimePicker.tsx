import {DateTimeInput, FormPatch, PatchEvent, InputProps, set, unset} from 'sanity'

import {getConstructedUTCDate, unlocalizeDateTime} from '../utils'
import {RichDate} from '../types'
import {formatInTimeZone, zonedTimeToUtc} from 'date-fns-tz'

interface RelativeDateTimePickerProps extends Omit<InputProps, 'renderDefault'> {
  dateValue?: RichDate
}

export const RelativeDateTimePicker = (props: RelativeDateTimePickerProps) => {
  const value = props.dateValue
  const timezone = value?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
  /*
   * if our offset is not coming from a lib, we have to reverse it
   * to get the real offset used everywhere
   * https://momentjscom.readthedocs.io/en/latest/moment/03-manipulating/09-utc-offset/
   */
  const offset = value?.offset ?? new Date().getTimezoneOffset() * -1
  const handleDateChange = (patch: FormPatch | PatchEvent | FormPatch[]) => {
    const patches = []
    const newDatetime = (patch as unknown as {value: string})?.value
    if (!newDatetime || !('type' in patch) || patch.type !== 'set') {
      props.onChange(unset())
      return
    }

    //get what time the user "meant" to set without tz info
    //since the datepicker always localizes to the user's timezone
    const desiredDateTime = unlocalizeDateTime(
      newDatetime,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    )

    //use the user-selected timezone here
    const utcDate = zonedTimeToUtc(desiredDateTime, timezone).toISOString()
    const localDate = formatInTimeZone(utcDate, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX")

    patches.push(set(utcDate, ['utc']))
    patches.push(set(localDate, ['local']))

    if (!value?.timezone) {
      patches.push(set(timezone, ['timezone']))
    }

    if (!value?.offset) {
      patches.push(set(offset, ['offset']))
    }

    props.onChange(patches)
  }

  const dateToDisplay = value?.utc ? getConstructedUTCDate(value.utc, value.offset) : ''
  //@ts-expect-error -- slight mismatch in elementProps and renderDefault, but should line up in practice
  return <DateTimeInput {...props} onChange={handleDateChange} value={dateToDisplay} />
}
