# Pigura
[![npm version](https://badge.fury.io/js/pigura.svg)](https://badge.fury.io/js/pigura)

Simple configuration file loader.

## What is It?

1) Let's say you have a file named `config.json` containing your app settings.

1) You have a file named `config.prod.json` containing your app settings for PRODUCTION.

1) Running your app on development mode, will only load `config.json`.

1) Running your app in production, will load both `config.json`, MERGED with `config.prod.json`

1) You dont need to copy all the settings from `config.json` to `config.prod.json`. Just the settings to override. Removing the need to maintain both files in sync.


## Install

#### Choose 1 of 3 options:

Install from NPM:

    npm install pigura

Install latest from GitHub:

    npm install github:kosinix/pigura

Tied to a specific version/release from GitHub:

    npm install github:kosinix/pigura#1.0.0
    
## Quickstart

You only need to provide 3 parameters:

* configName - The path to your config file relative to your app's root dir
* appDir - App's root dir
* env - The env variable. The default value is "dev". Any other value will load the config file + config.env file. See Convention.
* logging (optional) - true to use console.log


        const pigura = require('pigura');

        let configLoader = new pigura.ConfigLoader({ 
            configName: './config.json',
            appDir: path.resolve(__dirname),
            env: 'dev'
        })

        let config = configLoader.getConfig();
        console.log(config)

## Examples

The recommended way to switch between environments is to use NODE_ENV. There are other ways as well but pigura does not care how you get the env variable.

### Production Environment using NPM Script

In your package.json scripts section

    {
        ...
        "scripts": {
            "prod": "set NODE_ENV=prod&& node index.js",
        }
        ...
    }

In the command line you type:

    npm run prod

Then in your main file:

    let configLoader = new pigura.ConfigLoader({ 
        configName: 'config.json',
        appDir: path.resolve(__dirname),
        env: process.env.NODE_ENV // Pass to pigura
    })
    let config = configLoader.getConfig();
    console.log(config)

This will:
* Read the contents of `config.json`
* Read `config.prod.json` and merged it with `config.json`. The same settings in `config.prod.json` will override the settings in `config.json`

### Get Base Config Only

You can get the base config only, disregarding the env variable, and child configs:

    let config = configLoader.getConfig(true);

## Convention
#### Naming

Base config: 

    `${configName}.json` - config.json

Child configs: 

    `${configName}.${env}.json` - config.sandbox.json

#### Why "." as separator for env?

So you can name your configs with dash separators:

    config-foo-bar.json
    config-foo-bar.sandbox.json
    config-foo-bar.prod.json

Or:

    configFooBar.json
    configFooBar.sandbox.json
    configFooBar.prod.json

## Test

    npm test