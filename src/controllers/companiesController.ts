import { Request, Response } from 'express'
import { Company } from '../models/company'

const companiesController = {
  index: async (req: Request, res: Response) => {
    try {
      const companies = await Company.findAll()
      return res.json(companies)
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  },

  save: async (req: Request, res: Response) => {
    const { name, bio, website, email } = req.body

    try {
      const company = await Company.create({
        name,
        bio,
        website,
        email,
      })

      return res.status(201).json(company)
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  },
}

export { companiesController }
