# dbot : The only discordbot you will need

This readme will be updated with more info as coding moves forward.

## What is it?

dbot is a Discord bot that will contain everything needed for a discord server, except music.

## Requirements

* Node v8+
* Yarn
* RethinkDb(Will be changed to redis to handle data faster)

## Dev Env

* Be sure to have node v8 and rethink running in the background.
  Install all packages by `yarn install --production=false`
* Edit the default.example.json to default.json and enter the correct data.
* Run the dev version (live updating on changes) with `yarn run start`, you can build a version with `yarn run build`.
