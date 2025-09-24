const { createLogger, transports, format } = require("winston")
const { join } = require("path")
const { ecsFormat, ecsFields, ecsStringify } = require('@elastic/ecs-winston-format');

class LoggerUtils {
    constructor(){}
    async logError(request, response, error, reference) {
        // Ensure inputs are objects
        request = request || {};
        response = response || {};
        
        let requestUrl = request.originalUrl || request.url || "";
        let reqBody = request.body || {};
        let resData = response.data || {};
        let errObject = error || {};

        const errorLog = {
            requestUrl: requestUrl,
            request: reqBody,
            response: resData,
            errorObject: {
                message: errObject.message || 'Unknown error',
                stack: errObject.stack || 'No stack trace',
                name: errObject.name || 'Error'
            },
            requestOrigin: request.headers?.origin || 'Unknown',
            reference: reference || 'Unknown reference'
        }

        const logFileName = (reference || 'unknown').split('.')[0] + '.log'

        const logConfiguration = {
            transports: [
                new transports.File({
                    filename: join(__dirname, '../..','all_logs',"all-logs-" + logFileName)
                })
            ],
            format: format.combine(
                format.timestamp({
                    format: 'DD-MMM-YYYY HH:mm:ss'
                }),
                format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
                ecsFields(),
                ecsStringify(),
            )
        }
        
        const logger = createLogger(logConfiguration)
        logger.error(reference || 'Error', errorLog)
        
        // Also log to console for immediate visibility
        console.error('Logged Error:', errorLog)
    }

    async logAll(request, response, error, reference) {
        let requestUrl = ""
        requestUrl = request.originalUrl? request.originalUrl : requestUrl
        let logAll = {}
        if(requestUrl){
            logAll.requestUrl = requestUrl
        }
        if(request?.body){
            logAll.request = request.body
        }
        if(response){
            logAll.response = response
        }
        if(error){
            logAll.errorObject = error
        }
        if(request?.user){
            logAll.userId = request.user._id
        }
        if(reference){
            logAll.reference = reference
        }
        const logFileName = reference.split('.')[0] + '.log'

        const logConfigurtaion = {
            transports: [
                new transports.File({
                    filename: join(__dirname, '../..','all_logs',"all-logs-" + logFileName)
                })
            ],
            format: format.combine(

                format.timestamp({
                    format: 'DD-MMM-YYYY HH:mm:ss'
                }),

                format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
                // format.json(),
                ecsFields(),
                ecsStringify(),
                
            )
        }
        
        const logger = createLogger(logConfigurtaion)
        logger.info(reference, logAll)
    }

    async logAllWarn(request, response, error, reference) {
        let requestUrl = ""
        requestUrl = request.originalUrl? request.originalUrl : requestUrl
        let logAll = {}
        if(requestUrl){
            logAll.requestUrl = requestUrl
        }
        if(request?.body){
            logAll.request = request.body
        }
        if(response){
            logAll.response = response
        }
        if(error){
            logAll.errorObject = error
        }
        if(request?.user){
            logAll.userId = request.user._id
        }
        if(reference){
            logAll.reference = reference
        }
        const logFileName = reference.split('.')[0] + '.log'

        const logConfigurtaion = {
            transports: [
                new transports.File({
                    filename: join(__dirname, '../..','all_logs',"all-logs-" + logFileName)
                })
            ],
            format: format.combine(

                format.timestamp({
                    format: 'DD-MMM-YYYY HH:mm:ss'
                }),

                format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
                // format.json(),
                ecsFields(),
                ecsStringify(),
            )
        }
        
        const logger = createLogger(logConfigurtaion)
        logger.warn(reference, logAll)
    }

    async logInfo(request, response, message, reference) {
        // Ensure inputs are objects
        request = request || {};
        response = response || {};
        
        const logInfo = {
            requestUrl: request.originalUrl || request.url || "",
            request: request.body || {},
            response: response.data || {},
            message: message || 'No message provided',
            requestOrigin: request.headers?.origin || 'Unknown',
            reference: reference || 'Unknown reference'
        }

        const logFileName = (reference || 'unknown').split('.')[0] + '.log'

        const logConfiguration = {
            transports: [
                new transports.File({
                    filename: join(__dirname, '../..','all_logs',"all-logs-" + logFileName)
                })
            ],
            format: format.combine(
                format.timestamp({
                    format: 'DD-MMM-YYYY HH:mm:ss'
                }),
                format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
                ecsFields(),
                ecsStringify(),
            )
        }
        
        const logger = createLogger(logConfiguration)
        logger.info(reference || 'Info', logInfo)
        
        // Also log to console for immediate visibility
        console.log('Logged Info:', logInfo)
    }
}

module.exports = LoggerUtils;