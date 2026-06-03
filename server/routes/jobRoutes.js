const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const { createNotification } = require('../utils/notificationUtils');

const { protect, admin } = require('../middleware/authMiddleware');

// --- JOBS ---

// GET jobs (Public: Active only; Admin: All with Pagination)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        let where = {};
        if (!req.query.admin) {
            where.status = 'Active';
        }

        const { count, rows } = await Job.findAndCountAll({
            where,
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        res.json({
            jobs: rows,
            total: count,
            pages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET single job (Public)
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST new job (Admin only)
router.post('/', protect, admin, async (req, res) => {
    try {
        const createdJob = await Job.create(req.body);
        res.status(201).json(createdJob);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PATCH update job (Admin only)
router.patch('/:id', protect, admin, async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        await job.update(req.body);
        res.json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE job (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        await job.destroy();
        res.json({ message: 'Job deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- APPLICATIONS ---

// POST apply for job (Public)
router.post('/:id/apply', async (req, res) => {
    try {
        const applicationData = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            resume: req.body.experience,
            portfolio: req.body.resumeLink,
            coverLetter: req.body.coverLetter,
            jobId: req.params.id
        };
        const createdApp = await JobApplication.create(applicationData);

        // Create Admin Notification
        await createNotification({
            type: 'job_application',
            title: 'New Job Application',
            message: `${createdApp.name} applied for a position`,
            link: `/admin/jobs`
        });

        res.status(201).json(createdApp);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET applications for a job (Admin)
router.get('/:id/applications', async (req, res) => {
    try {
        const applications = await JobApplication.findAll({
            where: { jobId: req.params.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PATCH update application status (Admin)
router.patch('/applications/:id', async (req, res) => {
    try {
        const application = await JobApplication.findByPk(req.params.id);
        if (!application) return res.status(404).json({ message: 'Application not found' });
        await application.update({ status: req.body.status });
        res.json(application);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
