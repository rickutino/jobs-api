import express from 'express'
import { candidatesController } from './controllers/candidatesController'
import { companiesController } from './controllers/companiesController'
import { jobsController } from './controllers/jobsController'

const router = express.Router()

router.get('/', (req, res) => res.json({ hello: 'Hello, world!' }))

router.get('/candidates', candidatesController.index)
router.post('/candidates', candidatesController.save)
router.get('/candidates/:id', candidatesController.show)
router.put('/candidates/:id', candidatesController.update)
router.delete('/candidates/:id', candidatesController.delete)

router.get('/companies', companiesController.index)
router.post('/companies', companiesController.save)
router.get('/companies/:id', companiesController.show)
router.put('/companies/:id', companiesController.update)
router.delete('/companies/:id', companiesController.delete)

router.get('/jobs', jobsController.index)
router.post('/jobs', jobsController.save)
router.get('/jobs/:id', jobsController.show)
router.put('/jobs/:id', jobsController.update)

export { router }
