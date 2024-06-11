"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerGlobal = exports.LoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
let LoggerMiddleware = class LoggerMiddleware {
    use(req, res, next) {
        const now = new Date().toISOString();
        const method = req.method;
        const url = req.url;
        console.log(`LoggerMiddleware: ${now} ${method} ${url}`);
        next();
    }
};
exports.LoggerMiddleware = LoggerMiddleware;
exports.LoggerMiddleware = LoggerMiddleware = __decorate([
    (0, common_1.Injectable)()
], LoggerMiddleware);
function loggerGlobal(req, res, next) {
    const now = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    console.log(`loggerGlobal: ${now} ${method} ${url}`);
    next();
}
exports.loggerGlobal = loggerGlobal;
//# sourceMappingURL=logger.middleware.js.map