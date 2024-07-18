import {Box, Dialog, Flex} from '@sanity/ui'
import {type ReactNode, useCallback, useState} from 'react'
import {ObjectInputMember, ObjectInputProps} from 'sanity'

import {RichDate} from '../types'
import {RelativeDateTimePicker} from './RelativeDateTimePicker'
import {TimezoneButton} from './TimezoneButton'
import {TimezoneSelector} from './TimezoneSelector'

export const RichDateInput = (props: ObjectInputProps): ReactNode => {
  const {onChange, value, members, schemaType} = props
  const {options} = schemaType
  const localMember = members.find((member) => member.kind === 'field' && member.name === 'local')
  const timezoneMember = members.find(
    (member) => member.kind === 'field' && member.name === 'timezone',
  )
  const [timezoneSelectorOpen, setTimezoneSelectorOpen] = useState(false)
  const onClose = useCallback(() => setTimezoneSelectorOpen(false), [])
  const onOpen = useCallback(() => setTimezoneSelectorOpen(true), [])

  return (
    <>
      <Flex>
        <Box flex={[1, 2, 4]}>
          {localMember && (
            <ObjectInputMember
              {...props}
              member={localMember}
              // eslint-disable-next-line react/jsx-no-bind
              renderInput={(renderInputProps) => (
                <RelativeDateTimePicker
                  {...renderInputProps}
                  dateValue={value as RichDate}
                  schemaType={{...renderInputProps.schemaType, options}}
                  onChange={onChange}
                />
              )}
            />
          )}
        </Box>
        <Box flex={[1]} marginLeft={[2, 2, 3, 4]}>
          {timezoneMember && (
            <ObjectInputMember
              {...props}
              member={timezoneMember}
              // eslint-disable-next-line react/jsx-no-bind
              renderInput={() => (
                <TimezoneButton onClick={onOpen} timezone={value?.timezone ?? ''} />
              )}
            />
          )}
        </Box>
      </Flex>
      {timezoneSelectorOpen && (
        <Dialog onClose={onClose} header="Select a timezone" id="timezone-select" width={1}>
          <TimezoneSelector onChange={onChange} value={value as RichDate} />
        </Dialog>
      )}
    </>
  )
}
