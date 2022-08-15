# Assemble Calendar

Assemble's **Run of Show** was planned on a Google Sheet. This is great
large-scale planning and visualizing everyone's schedules. However, for
individual staff members checking their schedules, scrolling through a massive
Google Sheet is cumbersome especially while running about the venue.

This Express.js server uses the Google Sheets API to pull spreadsheet data
regarding the Run of Show, and converts that data into JSON and ICS (calendar
import file).

## Usage

Replace my name with yours! It should be the same as your name in the "header"
row of the spreadsheet. Also, get the `authToken` from Gary.

- Personal Calendar: `https://assemble.garytou.dev/calendar/Gary?authToken=example`
- Personal JSON: `https://assemble.garytou.dev/json/Gary?authToken=example`


**Other links:**

- Frontend Calendar: `https://assemble.garytou.dev/calendar/Frontend?authToken=example`
- Frontend JSON: `https://assemble.garytou.dev/json/Frontend?authToken=example`
- Backend Calendar: `https://assemble.garytou.dev/calendar/Backend?authToken=example`
- Backend JSON: `https://assemble.garytou.dev/json/Backend?authToken=example`
- Everyone JSON: `https://assemble.garytou.dev/json?authToken=example`

## Contribute

```sh
git clone https://github.com/hackclub/assemble-calendar.git

cd assemble-calendar

yarn

yarn dev
```

### Deployment

Set the `env` variables. Then use the `Dockerfile`, or:

```
yarn build
yarn start
```
