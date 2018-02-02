import { schema } from 'normalizr'

export const skills = new schema.Entity('skills')

export const profile = new schema.Entity('profiles', {
  skillProfile: [skills]
})
