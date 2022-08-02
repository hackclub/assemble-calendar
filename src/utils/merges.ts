import { google, sheets_v4 } from 'googleapis';

const sheets = google.sheets({
	version: 'v4',
	auth: process.env.GOOGLE_API_KEY,
});

var merges: sheets_v4.Schema$GridRange[] = null;

const getMerges = async (sheetId: string) => {
	if (merges) return merges;

	const { data } = await sheets.spreadsheets.get({
		spreadsheetId: process.env.GOOGLE_SHEET_ID,
	});

	const worksheet = data.sheets.find(
		(s) => s.properties.sheetId.toString() == sheetId
	);

	merges = worksheet.merges;
	return merges;
};

export { getMerges };
