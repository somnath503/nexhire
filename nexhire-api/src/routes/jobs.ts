import { Router, Request, Response } from 'express';
import { pool } from '../db';


const router = Router();

// GET all jobs (Now fetches company description & URLs for the candidate view)
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT j.id, j.recruiter_id, j.title, j.stack, j.location, j.employment_type as type, j.status, j.applicants_count as applicants, TO_CHAR(j.created_at, 'Mon DD, YYYY') as date, 
             u.company_name, u.company_description, u.website_url, u.linkedin_url
      FROM jobs j
      LEFT JOIN users u ON j.recruiter_id = u.id
      ORDER BY j.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Replace the POST route in jobs.ts with this:
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { recruiter_id, title, stack, location, type, status, description } = req.body;
  if (!recruiter_id || !title || !location) { res.status(400).json({ error: 'Missing required fields' }); return; }

  try {
    const result = await pool.query(
      `INSERT INTO jobs (recruiter_id, title, stack, location, employment_type, status, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [recruiter_id, title, stack || '', location, type, status || 'PUBLISHED', description || '']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// PUT (Update) job status
router.put('/:id/status', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['PUBLISHED', 'DRAFT', 'CLOSED'].includes(status)) { res.status(400).json({ error: 'Invalid status' }); return; }

  try {
    const result = await pool.query(`UPDATE jobs SET status = $1 WHERE id = $2 RETURNING *`, [status, id]);
    if (result.rows.length === 0) { res.status(404).json({ error: 'Job not found' }); return; }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job status' });
  }
});

// POST (Apply to job) - Now tracks the specific candidate in the DB
router.post('/:id/apply', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { candidate_id } = req.body;

  if (!candidate_id) {
    res.status(400).json({ error: 'Candidate ID is required' });
    return;
  }

  try {
    // 1. Insert relation into applications table (ON CONFLICT prevents double applying)
    await pool.query(
      `INSERT INTO applications (job_id, candidate_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [id, candidate_id]
    );

    // 2. Increment applicant counter on the job
    const result = await pool.query(
      `UPDATE jobs SET applicants_count = applicants_count + 1 WHERE id = $1 RETURNING *`, 
      [id]
    );

    res.json({ message: 'Applied successfully', job: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to apply to job' });
  }
});

// DELETE a job
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const result = await pool.query(`DELETE FROM jobs WHERE id = $1 RETURNING id`, [id]);
    if (result.rows.length === 0) { res.status(404).json({ error: 'Job not found' }); return; }
    res.json({ message: 'Job deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

export default router;