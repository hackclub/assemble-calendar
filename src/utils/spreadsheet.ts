import {
	GoogleSpreadsheet,
	GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet';
import moment, { Moment } from 'moment';

var data: {
	doc: GoogleSpreadsheet;
	worksheets: {
		[k: string]: GoogleSpreadsheetWorksheet;
	};
} = null;
var cached_at: Moment = null;

const sheets = [
	{ id: 0, name: 'Main' },
	// { id: 197231011, name: 'km just crosschecking' },
	// { id: 1237747712, name: 'Yerba Buena' },
	// { id: 88681151, name: 'SFO Ferrying' },
	// { id: 652862407, name: 'Checkin' },
	// { id: 1289244998, name: 'Opening Ceremony' },
	// { id: 812396707, name: 'Dinner (D1) & Team Bonding' },
	// { id: 433449460, name: 'Workshops' },
	// { id: 298786400, name: '(Un)Talent Show' },
	// { id: 573808406, name: 'Midnight CTF' },
	// { id: 561667069, name: 'Breakfast (D2)' },
	// { id: 1449406779, name: 'Lightning Talks' },
	// { id: 135909068, name: 'Food Scavenger Hunt (Lunch, D2)' },
	// { id: 2045825479, name: 'Dinner (D2)' },
	// { id: 978779736, name: 'Disco' },
	// { id: 32085415, name: 'Breakfast (D3)' },
	// { id: 1723220093, name: 'Demos/Showcase/Judging' },
	// { id: 930215601, name: 'Closing Ceremony' },
	// { id: 492641226, name: 'End' },
	// { id: 963984539, name: 'Going Back To SFO' },
	// { id: 1717509185, name: 'Hacking / Chill Time' },
	// { id: 182965657, name: 'Sleeping' },
];

// Gosh dang it we need top-level await
const load = async () => {
	if (data && !cached_expired()) return data;
	console.log('getting sheets (cache expired)');

	const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
	doc.useApiKey(process.env.GOOGLE_API_KEY);

	await doc.loadInfo(); // loads document properties and worksheets

	const sheetsById = doc.sheetsById; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
	const loadedSheets: { [k: string]: GoogleSpreadsheetWorksheet } = {};
	for (let s of sheets) {
		const loadedSheet = sheetsById[s.id];
		await loadedSheet.loadCells();

		loadedSheets[s.name] = loadedSheet;
	}

	data = {
		doc,
		worksheets: loadedSheets,
	};

	return data;
};

const cached_expired = () => {
	return cached_at && moment().diff(cached_at, 'minutes', true) > 5;
};

export default load;
