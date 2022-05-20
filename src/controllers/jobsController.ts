import { Request, Response } from 'express'
import { Company, Job } from '../models'

const jobsController = {
  index: async (req: Request, res: Response) => {
    try {
      const jobs = await Job.findAll({ include: 'company' })
      return res.json(jobs)
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  },

  save: async (req: Request, res: Response) => {
    const { title, description, limitDate, companyId } = req.body
    const company = await Company.findByPk(companyId)
    
    if (!company) {
      return res.status(404).json({ message: 'Company not exits' })
    }

    try {
      const job = await Job.create({
        title,
        description,
        limitDate,
        companyId,
      })

      return res.status(201).json(job)
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  },

  show: async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const job = await Job.findByPk(id, { include: ['company', 'candidates'] })

      if (job === null) { 
        return res.status(404).json({ message: 'CompanyId not found' })
      }

      const candidatesCount = await job?.countCandidates()

      return res.json({ ...job?.get(), candidatesCount })
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  },

  update: async (req: Request, res: Response) => {
    const { id } = req.params
    const { title, description, limitDate, companyId } = req.body

    try {
      const [affectedRows, jobs] = await Job.update({
        title,
        description,
        limitDate,
        companyId,
      }, {
        where: { id },
        returning: true
      })

      if (jobs.length <= 0 ) {
        return res.status(404).json({ message: 'Job not found' })
      }

      return res.json(jobs[0])
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  },

  delete: async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const jobDeleted = await Job.destroy({
        where: { id: id }
      })

    if (!jobDeleted) {
      return res.status(404).json({ message: "Can't delete of Job, it id not found." })
    }

      return res.status(204).send()
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  },

  addCandidate: async (req: Request, res: Response) => {
    const jobId = req.params.id
    const { candidateId } = req.body

    try {
      const job = await Job.findByPk(jobId)
      
      if (job === null) return res.status(404).json({ message: 'Job vacancy not found' })

      await job.addCandidate(candidateId)

      return res.status(201).send()
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  },

  removeCandidate: async (req: Request, res: Response) => {
    const jobId = req.params.id
    const { candidateId } = req.body

    try {
        const job = await Job.findByPk(jobId)

        if (job === null) return res.status(404).json({ message: 'Job vacancy not found' })

        await job.removeCandidate(candidateId)

        return res.status(204).send()
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({ message: err.message })
        }
    }
  },
}

export { jobsController }
