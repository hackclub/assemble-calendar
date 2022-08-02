import express, { Router, Request, Response, NextFunction } from 'express';
import { getPersonalCalendar } from './helpers/calendar';
import { allPersonal, getPersonal } from './helpers/runOfShow';

const router: Router = express.Router();

// Express body-parser
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Ping Pong (test endpoint)
router.get('/ping', (req: Request, res: Response) => {
	res.send('pong! 🏓');
});

const ensureAuth = (req: Request, res: Response, next: NextFunction) => {
	if (req.query.authToken == process.env.AUTH_TOKEN) {
		return next();
	}

	res.status(401).json({
		message: 'bye bye. ur unauthenticated',
	});
};

router.get('/json', ensureAuth, async (req: Request, res: Response) => {
	const response = {
		personal: await allPersonal(),
	};

	res.json(response);
});

router.get('/json/:name', ensureAuth, async (req: Request, res: Response) => {
	const name = req.params.name;

	const response = await getPersonal(name);
	console.log(response);

	res.json(response);
});

router.get(
	'/calendar/:name',
	ensureAuth,
	async (req: Request, res: Response) => {
		const name = req.params.name;
		const calendar = await getPersonalCalendar(name);
		calendar.serve(res, `${name}-Assemble-Calendar.ics`);
	}
);

export default router;
