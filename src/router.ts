import express, { Router, Request, Response } from 'express';
import { allPersonal } from './helpers/runOfShow';

const router: Router = express.Router();

// Express body-parser
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Ping Pong (test endpoint)
router.get('/ping', (req: Request, res: Response) => {
	res.send('pong! 🏓');
});

router.get('/json', async (req: Request, res: Response) => {
	console.log(await allPersonal());

	const response = {
		personal: await allPersonal(),
	};

	res.json(response);
});

export default router;
