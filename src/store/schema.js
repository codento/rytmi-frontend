import { schema } from 'normalizr'

export const skill = new schema.Entity('skills')

export const skillCategory = new schema.Entity('skillCategories')

export const skillGroup = new schema.Entity('skillGroups')

export const employeeRole = new schema.Entity('employeeRoles')

export const profile = new schema.Entity('profiles')

export const profileEmployer = new schema.Entity('profileEmployers')

export const user = new schema.Entity('users')

export const project = new schema.Entity('projects')

export const employer = new schema.Entity('employers')

export const leave = new schema.Entity('leaves')

export const absence = new schema.Entity('absences')
