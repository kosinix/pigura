//// Core modules
const path = require('path');

//// External modules
const expect = require("chai").expect;

//// First things first
//// Save full path of our root app directory and load config and credentials for convenience
global.APP_DIR = path.resolve('./').replace(/\\/g, '/'); // Turn back slash to slash for cross-platform compat

//// Modules
const pigura = require('../index');


    describe("Load config.json on dev environment", ()=> {
        let configLoader = new pigura.ConfigLoader({ 
            configName: './test-data/config.json',
            appDir: APP_DIR,
            env: 'dev',
            logging: false
        })
        
        it("config.express.trustProxy must be false", async ()=> {
            let config = configLoader.getConfig();
            expect(config.express.trustProxy).to.equal(false);
        });
        it("config.session.cookie.httpOnly must be false", async ()=> {
            let config = configLoader.getConfig();
            expect(config.session.cookie.httpOnly).to.equal(false);
        });
    });

    describe("Load config.json on prod environment. Should merge with config.prod.json.", ()=> {
        let configLoader = new pigura.ConfigLoader({ 
            configName: './test-data/config.json',
            appDir: APP_DIR,
            env: 'prod',
            logging: false
        })
        
        it("config.express.trustProxy must be true", async ()=> {
            let config = configLoader.getConfig();
            expect(config.express.trustProxy).to.equal(true);
        });
        it("config.session.cookie.httpOnly must be true", async ()=> {
            let config = configLoader.getConfig();
            expect(config.session.cookie.httpOnly).to.equal(true);
        });
    });

    describe("Load config.json on prod environment. But ignore child configs.", ()=> {
        let configLoader = new pigura.ConfigLoader({ 
            configName: './test-data/config.json',
            appDir: APP_DIR,
            env: 'prod',
            logging: false
        })
        
        it("config.express.trustProxy must be false", async ()=> {
            let config = configLoader.getConfig(true);
            expect(config.express.trustProxy).to.equal(false);
        });
    });




