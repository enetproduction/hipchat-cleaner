# hipchat-cleaner

[![Greenkeeper badge](https://badges.greenkeeper.io/enetproduction/hipchat-cleaner.svg)](https://greenkeeper.io/)
Cleans old unactive topics from hipchat

`master`
[![Build Status](https://travis-ci.org/enetproduction/hipchat-cleaner.svg?branch=master)](https://travis-ci.org/enetproduction/hipchat-cleaner)

## Usage

See help:

`node hipchat-cleaner.js -h`

Usage samples:

`node hipchat-cleaner.js -i // interactive mode (recommended)`

Remove rooms unactive for **6 months** (default duration)

`node hipchat-cleaner.js --apiKey <YOUR_API_KEY>`

Remove rooms unactive for at least **one month**

`node hipchat-cleaner.js --apiKey <YOUR_API_KEY> --duration P1M`

Remove rooms unactive for at least **twelve hours**

`node hipchat-cleaner.js --apiKey <YOUR_API_KEY> --duration PT12H`

## Duration format

Duration uses ISO 8601 format for durations, see [Wikipedia](https://en.wikipedia.org/wiki/ISO_8601#Time_intervals) for more

## Interactive mode

Interactive mode will ask you questions about API Key and duration of your choice.
After this it will show all criteria-fitting rooms and you may choose which one to remove (cli checkbox)

## Inline CLI mode

If you would like to use HipChat Cleaner as for example cron-runned command you can use inline mode.

**Warning**

Please be careful while using it - it removed channels without asking after the command is run.

**Better to test API Key and duration with interactive mode first.**
