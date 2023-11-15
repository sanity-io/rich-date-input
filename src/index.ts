import {definePlugin} from 'sanity'
import {richDateSchema, RichDateDefinition, RichDateSchemaType} from './schema'
import {RichDate} from './types'

export const richDate = definePlugin({
  name: 'v3-rich-date-input',
  schema: {
    types: [richDateSchema],
  },
})

export type {RichDateDefinition, RichDateSchemaType, RichDate}
