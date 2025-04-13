import moment from 'moment';

const DEBUG = false;

export default class Logger {
    constructor() {
    }

    static log(text: string, type: Nullable<string> = null) {
        return console.log(`${Logger.getTimestamp()} ${type ? type.toUpperCase() + ' ' : ''}${Logger.white('LOG')} ${text}`);
    }

    static info(text: string, type: Nullable<string> = null) {
        return console.log(`${Logger.getTimestamp()} ${type ? type.toUpperCase() + ' ' : ''}${Logger.blue('INFO')} ${text}`);
    }

    static warn(text: string, type: Nullable<string> = null) {
        return console.log(`${Logger.getTimestamp()} ${type ? type.toUpperCase() + ' ' : ''}${Logger.yellow('WARN')} ${text}`);
    }

    static error(text: string, type: Nullable<string> = null) {
        return console.log(`${Logger.getTimestamp()} ${type ? type.toUpperCase() + ' ' : ''}${Logger.red('ERROR')} ${text}`);
    }

    static ratelimit(text: string, type: Nullable<string> = null) {
        return console.log(`${Logger.getTimestamp()} ${type ? type.toUpperCase() + ' ' : ''}${Logger.magenta('RATELIMIT')} ${text}`);
    }

    static debug(text: string, type: Nullable<string> = null) {
        if (!DEBUG) return;

        return console.log(`${Logger.getTimestamp()} ${type ? type.toUpperCase() + ' ' : ''}${Logger.green('DEBUG')} ${text}`);
    }

    static default(text: string, type: Nullable<string> = null) {
        return console.log(`${Logger.getTimestamp()} ${type ? type.toUpperCase() + ' ' : ''}${text}`);
    }

    // Timestamp
    static getTimestamp() {
        return `[${moment().format('YYYY-MM-DD HH:mm:ss')}]:`;
    }

    // Color's
    static blue(text: string) {
        return `\x1b[44m${text}\x1b[0m`;
    }

    static green(text: string) {
        return `\x1b[42m${text}\x1b[0m`;
    }

    static red(text: string) {
        return `\x1b[41m${text}\x1b[0m`;
    }

    static yellow(text: string) {
        return `\x1b[43m${text}\x1b[0m`;
    }

    static white(text: string) {
        return `\x1b[47m${text}\x1b[0m`;
    }

    static magenta(text: string) {
        return `\x1b[45m${text}\x1b[0m`;
    }
}