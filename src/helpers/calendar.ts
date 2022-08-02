import ical from 'ical-generator';
import { getPersonal } from './runOfShow';

export const PT_TZ = 'America/Los_Angeles';

export const getPersonalCalendar = async (name: string, title?: string) => {
	const calendar = ical({
		name: title || `${name}'s Calendar for Assemble`,
		description: 'wahoo',
		timezone: PT_TZ,
	});

	const events = await getPersonal(name);

	events.forEach((e) => {
		calendar.createEvent({
			start: e.startTime,
			end: e.endTime,
			summary: e.title,
			// location: 'check the sheet',
			// url: ''
			// timezone: PT_TZ,
		});
	});

	return calendar;
};
