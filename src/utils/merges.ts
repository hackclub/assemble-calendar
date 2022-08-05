import { google, sheets_v4 } from 'googleapis';
import moment from 'moment';
import { Moment } from 'moment';

const sheets = google.sheets({
	version: 'v4',
	auth: process.env.GOOGLE_API_KEY,
});
var cached_at: Moment = null;

var merges: sheets_v4.Schema$GridRange[] = null;

const getMerges = async (sheetId: string) => {
	if (merges && !cached_expired()) return merges;
	console.log('getting merges (cache expired)');

	const { data } = await sheets.spreadsheets.get({
		spreadsheetId: process.env.GOOGLE_SHEET_ID,
	});

	const worksheet = data.sheets.find(
		(s) => s.properties.sheetId.toString() == sheetId
	);

	merges = worksheet.merges;
	return merges;
};

const cached_expired = () => {
	return cached_at && moment().diff(cached_at, 'minutes', true) > 5;
};

export { getMerges };
