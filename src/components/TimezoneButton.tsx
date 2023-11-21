import {Button} from '@sanity/ui'
import {EarthAmericasIcon} from '@sanity/icons'
import {allTimezones} from '../utils'
import {NormalizedTimeZone} from '../types'

interface TimezoneButtonProps {
  onClick: () => void
  timezone: string
}

export const TimezoneButton = (props: TimezoneButtonProps) => {
  const {onClick, timezone} = props
  const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const label =
    allTimezones.find((tz: NormalizedTimeZone) => tz.name === timezone)?.abbreviation ??
    allTimezones.find((tz: NormalizedTimeZone) => tz.name === currentTimezone)?.abbreviation

  return (
    <Button
      fontSize={1}
      style={{width: '100%'}}
      justify={'flex-start'}
      icon={EarthAmericasIcon}
      mode="ghost"
      onClick={onClick}
      text={`${label}`}
      aria-label="Select a timezone"
    />
  )
}
