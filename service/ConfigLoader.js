//// Core modules
const fs = require('fs');
const path = require('path');

//// External modules
const lodashMerge = require('lodash.merge');

//// Modules


/**
 * Class for Config service
 * 
 * @example 
 * let configLoader = new ConfigLoader({
    appDir: APP_DIR,
    env: env,
    configName: 'config',
    fnNamingConvention: (appDir, configName = 'config', env = 'dev') => {
        if(env==='dev'){
            return path.join(appDir, `${configName}.json`);
        }
        return path.join(appDir, `${configName}-${env}.json`);
    }
})
 */
class ConfigLoader {
    /**
     * Instantiate class
     * 
     * @param {Object} params
     * @throws {Error}
     */
    constructor(params) {

        // Defaults
        this._configName = params.configName || '/config.json';
        this._appDir = params.appDir || '';
        this._env = params.env || 'dev';
        this._logging = (typeof params.logging === "boolean") ? params.logging : false;

        let defaultNamingConvention = (appDir, configName, env) => {
            return path.join(appDir, `${configName}-${env}.json`);
        }

        this._namingConvention = (typeof params.fnNamingConvention === "function") ? params.fnNamingConvention : defaultNamingConvention;
    }

    getConfig(solo = false) {
        try {
            let configFile = path.join(this._appDir, `${this._configName}`);
            let config = fs.readFileSync(configFile, { encoding: 'utf8' }); // Will fail if not found
            if (this._logging) console.log(`Read file "${configFile}"`);
            config = config.replace(/\${APP_DIR}/g, this._appDir);
            config = JSON.parse(config);
            
            if (this._env !== 'dev' && solo !== true) {
                try {
                    let parsed = path.parse(configFile)
                    let filePath = path.join(parsed.dir, `${parsed.name}.${this._env}.json`)
                    let extraConfig = fs.readFileSync(filePath, { encoding: 'utf8' });
                    extraConfig = extraConfig.replace(/\${APP_DIR}/g, this._appDir);
                    extraConfig = JSON.parse(extraConfig);
                    if (this._logging) console.log(`Read file "${filePath}"`);
                    config = lodashMerge(config, extraConfig);
                } catch (err) {
                    // Ignore
                }
            }
            return config
        } catch(err) {
            throw new Error(err.message)
        }
    }

}

module.exports = ConfigLoader