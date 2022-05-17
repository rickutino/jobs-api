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

  show: async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const company = await Company.findByPk(id, { include: 'jobs' })

      if (company === null) { 
        return res.status(404).json({ message: 'Company not found' })
      }

      return res.json(company)
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
},
}

export { jobsController }