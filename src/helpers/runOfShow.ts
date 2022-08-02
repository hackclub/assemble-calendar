// Helpers are intended to house code that is used in multiple locations or
// apply to the overall application. For example, a `consts.ts` can be defined
// to hold constants shared across the application.

import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import moment, { Moment } from 'moment';
import loadSheet from '../utils/spreadsheet';

async function findColumn(sheet: GoogleSpreadsheetWorksheet, header: string) {
	for (let col = 0; col < 50; col++) {
		const cell = sheet.getCell(0, col);
		const value = cell.value;

		if (header.toLowerCase() == value?.toString()?.toLowerCase()) {
			return cell.columnIndex;
		}
	}
	return null;
}

/**
 * @param row number
 */
async function getTime(row: number) {
	const sheet = (await loadSheet()).worksheets['Main'];
	const time = sheet.getCell(row, 1);

	let date = sheet.getCell(row, 0); // may be null if not the top-left cell of merged cell
	for (let i = 1; i <= 100; i++) {
		if (date.value) break;

		// search upwards to find the top-left cell
		const searchRow = row - i;
		if (searchRow < 0) break;

		date = sheet.getCell(searchRow, 0);
	}

	if (!date.value || !time.value) return null; // give up
	const humanDate = `${date.formattedValue} ${time.formattedValue}`;

	return moment(humanDate, 'dddd h:mm');
}

export const getPersonal = async (name: string) => {
	const sheet = (await loadSheet()).worksheets['Main'];
	const column = await findColumn(sheet, name);

	const events: { title: string; startTime: Moment; endTime: Moment }[] = [];

	for (let row = 1; row < 200; row++) {
		const cell = sheet.getCell(row, column);
		const value = cell.formattedValue;

		if (!value) continue;

		const time = await getTime(row);

		if (events.length > 0) {
			// back fill end time
			events[events.length - 1].endTime = time;
		}

		// TODO: hyperlink descriptions
		events.push({
			title: value,
			startTime: time,
			endTime: null,
		});
	}

	// hard code end of event
	const lastEvent = events[events.length - 1];
	if (!lastEvent.endTime) {
		lastEvent.endTime = await getTime(189);
	}

	return events;
};

export const STAFF = [
	'Sam',
	'Zach',
	'Max',
	'Christina',
	'Kara',
	'Leo',
	'Holly',
	'Cedric',
	'Mel',
	'Liv',
	'Chris',
	'Caleb',
	'Deven',
	'Gary',
	'Ishan',
	'Ella',
	'Celeste',
	'Hugo',
	'Ian',
	'Pranav',
	'Charlie',
	'Benjamin',
	'Theo',
	'Athul',
	'Kunal',
	'Kevin',
];

export const allPersonal = async () => {
	const data: { [k: string]: Awaited<ReturnType<typeof getPersonal>> } = {};

	await Promise.all(
		STAFF.map(async (n) => {
			data[n] = await getPersonal(n);
		})
	);

	return data;
};
