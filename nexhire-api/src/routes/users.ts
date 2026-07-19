import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

// Replace ONLY the PUT /profile endpoint inside nexhire-api/src/routes/users.ts

router.put('/profile', async (req: Request, res: Response): Promise<void> => {
  const { 
    email, name, company_name, industry, company_description, website_url, linkedin_url, 
    resume_url, github_url, skills, title, education, experience, projects 
  } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE users 
       SET name = COALESCE($1, name), 
           company_name = COALESCE($2, company_name), 
           industry = COALESCE($3, industry), 
           company_description = COALESCE($4, company_description), 
           website_url = COALESCE($5, website_url), 
           linkedin_url = COALESCE($6, linkedin_url),
           resume_url = COALESCE($7, resume_url),
           github_url = COALESCE($8, github_url),
           skills = COALESCE($9, skills),
           title = COALESCE($10, title),
           education = COALESCE($11, education),
           experience = COALESCE($12, experience),
           projects = COALESCE($13, projects)
       WHERE email = $14 RETURNING *`,
      [name, company_name, industry, company_description, website_url, linkedin_url, resume_url, github_url, skills, title, education, experience, projects, email]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    // Remove password from response
    delete result.rows[0].password_hash;
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Permanently Delete Account
router.delete('/account', async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const result = await pool.query(`DELETE FROM users WHERE email = $1 RETURNING id`, [email]);
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    await pool.query(`DELETE FROM otps WHERE email = $1`, [email]);

    res.json({ message: 'Account and all associated data permanently deleted.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

export default router;