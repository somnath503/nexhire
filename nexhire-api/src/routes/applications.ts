import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

// GET all applications for a specific recruiter's jobs
router.get('/recruiter/:recruiterId', async (req: Request, res: Response) => {
  const { recruiterId } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        a.id as application_id, a.status, TO_CHAR(a.applied_at, 'Mon DD, YYYY') as date,
        j.title as job_title, j.id as job_id,
        u.id as candidate_id, u.name, u.email, u.resume_url, u.skills, u.title as candidate_title
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON a.candidate_id = u.id
      WHERE j.recruiter_id = $1
      ORDER BY a.applied_at DESC
    `, [recruiterId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// GET all applications by a specific candidate
router.get('/candidate/:candidateId', async (req: Request, res: Response) => {
  const { candidateId } = req.params;
  try {
    const result = await pool.query(
      `SELECT job_id FROM applications WHERE candidate_id = $1`, 
      [candidateId]
    );
    res.json(result.rows.map(row => row.job_id));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user applications' });
  }
});

// PUT update status
router.put('/:id/status', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(`UPDATE applications SET status = $1 WHERE id = $2 RETURNING *`, [status, id]);
    if (result.rows.length === 0) { res.status(404).json({ error: 'Application not found' }); return; }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// GET detailed applications for a candidate's dashboard
router.get('/candidate/:candidateId/details', async (req: Request, res: Response) => {
  const { candidateId } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        a.id as application_id, a.status, TO_CHAR(a.applied_at, 'Mon DD, YYYY') as date,
        j.title as job_title, j.location,
        u.company_name
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON j.recruiter_id = u.id
      WHERE a.candidate_id = $1
      ORDER BY a.applied_at DESC
    `, [candidateId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch detailed applications' });
  }
});

export default router;