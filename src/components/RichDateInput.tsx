import {ObjectInputMember, ObjectInputProps} from 'sanity'
import {Box, Flex, Dialog} from '@sanity/ui'
import {RelativeDateTimePicker} from './RelativeDateTimePicker'
import {TimezoneSelector} from './TimezoneSelector'
import {useCallback, useState} from 'react'
import {TimezoneButton} from './TimezoneButton'
import {RichDate} from '../types'

export const RichDateInput = (props: ObjectInputProps) => {
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
