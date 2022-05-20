import { Candidate } from './candidate'
import { Company } from './company'
import { Job } from './job'

Candidate.belongsToMany(Job, { through: 'job_candidates'})

Company.hasMany(Job)

Job.belongsTo(Company)
Job.belongsToMany(Candidate, { through: 'job_candidates'})

export {
    Candidate,
    Company,
    Job
}
