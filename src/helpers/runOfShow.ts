// Helpers are intended to house code that is used in multiple locations or
// apply to the overall application. For example, a `consts.ts` can be defined
// to hold constants shared across the application.

import { Color, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import moment, { Moment } from 'moment';
import { getMerges } from '../utils/merges';
import loadSheet from '../utils/spreadsheet';

const END_ROW = 189;

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

async function getRootCell(
	sheetId: string,
	row: number,
	column: number
): Promise<{ row: number; column: number } | null> {
	const merges = await getMerges(sheetId);
	const matching = merges.find((m) => {
		return (
			row < m.endRowIndex &&
			row >= m.startRowIndex &&
			column < m.endColumnIndex &&
			column >= m.startColumnIndex
		);
	});

	if (!matching) return null;

	return {
		row: matching.startRowIndex,
		column: matching.startColumnIndex,
	};
}

export const DAYS_OF_WEEK_TO_MOMENT: { [k: string]: Moment } = {
	wednesday: moment('2022-08-03'),
	thursday: moment('2022-08-04'),
	friday: moment('2022-08-05'),
	saturday: moment('2022-08-06'),
	sunday: moment('2022-08-07'),
	monday: moment('2022-08-08'),
	tuesday: moment('2022-08-09'),
};

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

	const dateKey: string = date.formattedValue.toString().toLowerCase();
	const momentDate = DAYS_OF_WEEK_TO_MOMENT[dateKey];
	const humanDate = `${momentDate.format('YYYY-MM-DD')} ${time.formattedValue}`;

	return moment(humanDate, 'YYYY-MM-DD h:mm');
}

export const getPersonal = async (name: string) => {
	const sheet = (await loadSheet()).worksheets['Main'];
	const column = await findColumn(sheet, name);

	const events: {
		title: string;
		startTime: Moment;
		endTime: Moment;
		row: number;
		column: number;
	}[] = [];

	for (let row = 1; row < END_ROW; row++) {
		let cell = sheet.getCell(row, column);

		if (!cell.value) {
			const root = await getRootCell(sheet.sheetId, row, column);
			if (!root) continue;

			cell = sheet.getCell(root.row, root.column);
			if (!cell.value) continue;

			const existing = events.some((e) => {
				return e.row == cell.rowIndex && e.column == cell.columnIndex;
			});
			if (existing) continue;
		}

		let value = cell.formattedValue;
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
			row: cell.rowIndex,
			column: cell.columnIndex,
		});
	}

	// hard code end of event
	const lastEvent = events[events.length - 1];
	if (!lastEvent.endTime) {
		lastEvent.endTime = await getTime(END_ROW);
	}

	// filter out N/A events
	return events.filter((e) => e.title != 'NA');
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

	for (let s of STAFF) {
		data[s] = await getPersonal(s);
	}

	return data;
};
