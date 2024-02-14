import {SearchIcon} from '@sanity/icons'
import {ObjectInputProps, set} from 'sanity'
import {allTimezones, unlocalizeDateTime} from '../utils'
import {NormalizedTimeZone, RichDate} from '../types'
import {Autocomplete, Card, Text, Box} from '@sanity/ui'
import {formatInTimeZone, zonedTimeToUtc} from 'date-fns-tz'

interface TimezoneSelectorProps {
  onChange: Pick<ObjectInputProps, 'onChange'>['onChange']
  value?: RichDate
}

export const TimezoneSelector = (props: TimezoneSelectorProps) => {
  const {onChange, value} = props
  const currentTz = allTimezones.find((tz) => tz.name === value?.timezone)
  const userTzName = Intl.DateTimeFormat().resolvedOptions().timeZone
  const userTz = (allTimezones.find((tz) => tz.name === userTzName) ??
    allTimezones.find((tz: NormalizedTimeZone) => tz.group.includes(userTzName)))!

  const handleTimezoneChange = (selectedTz: string) => {
    const newTimezone =
      allTimezones.find((tz) => tz.value === selectedTz) ?? (userTz as NormalizedTimeZone)

    const offset = newTimezone.currentTimeOffsetInMinutes ?? 0
    const timezonePatch = set(newTimezone.name, ['timezone'])
    const offsetPatch = set(offset, ['offset'])
    const patches = [timezonePatch, offsetPatch]

    //then, recalculate UTC and local from "old" time with the new offset
    if (value?.utc) {
      const desiredDateTime = unlocalizeDateTime(value.utc, value.timezone)
      const newUtcDate = zonedTimeToUtc(desiredDateTime, newTimezone.name).toISOString()
      const newLocalDate = formatInTimeZone(
        newUtcDate,
        newTimezone.name,
        "yyyy-MM-dd'T'HH:mm:ssXXX",
      )
      patches.push(set(newUtcDate, ['utc']))
      patches.push(set(newLocalDate, ['local']))
    }
    onChange(patches)
  }

  return (
    //taken from Scheduled Publishing, again!
    //https://github.com/sanity-io/sanity-plugin-scheduled-publishing/blob/bb282e3df9a8a73df37fab8ee1fdd0e2430745be/src/components/dialogs/DialogTimeZone.tsx#L100
    <Box padding={4}>
      <Autocomplete
        fontSize={2}
        icon={SearchIcon}
        id="timezone"
        onChange={handleTimezoneChange}
        openButton
        options={allTimezones}
        padding={4}
        placeholder="Search for a city or time zone"
        popover={{
          boundaryElement: document.querySelector('body'),
          constrainSize: true,
          placement: 'bottom-start',
        }}
        renderOption={(option) => {
          return (
            <Card as="button" padding={3}>
              <Text size={1} textOverflow="ellipsis">
                <span>GMT{option.offset}</span>
                <span style={{fontWeight: 500, marginLeft: '1em'}}>{option.alternativeName}</span>
                <span style={{marginLeft: '1em'}}>{option.mainCities}</span>
              </Text>
            </Card>
          )
        }}
        renderValue={(_, option) => {
          if (!option) return ''
          return `${option.alternativeName} (${option.namePretty})`
        }}
        tabIndex={-1}
        value={currentTz?.value ?? userTz.value}
      />
    </Box>
  )
}
