import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import path from 'path';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-default-key-change-me';

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: { userId: string };
        }
    }
}

// Custom Auth Middleware
const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized: Missing token' });
        return;
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
        return;
    }
};

// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password required' });
            return;
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, passwordHash },
        });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user.id, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/auth/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password required' });
            return;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- JOBS ROUTES (Protected) ---
app.use('/api/jobs', requireAuth);

app.get('/api/jobs', async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;
        const jobs = await prisma.job.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

app.post('/api/jobs', async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;
        const jobData = { ...req.body, userId };
        const job = await prisma.job.create({
            data: jobData
        });
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create job' });
    }
});

app.put('/api/jobs/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const userId = req.user!.userId;

        const existingJob = await prisma.job.findUnique({ where: { id } });
        if (!existingJob || existingJob.userId !== userId) {
            res.status(404).json({ error: 'Job not found or unauthorized' });
            return;
        }

        const job = await prisma.job.update({
            where: { id },
            data: req.body
        });
        res.json(job);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update job' });
    }
});

app.delete('/api/jobs/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const userId = req.user!.userId;

        const existingJob = await prisma.job.findUnique({ where: { id } });
        if (!existingJob || existingJob.userId !== userId) {
            res.status(404).json({ error: 'Job not found or unauthorized' });
            return;
        }

        await prisma.job.delete({ where: { id } });
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete job' });
    }
});

// --- SERVE FRONTEND (PRODUCTION) ---
if (process.env.NODE_ENV === 'production') {
    // Path assumes the file is running from backend/dist/server.js
    const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');

    app.use(express.static(frontendDistPath));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(frontendDistPath, 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
