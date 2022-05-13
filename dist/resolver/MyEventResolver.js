"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyEventResolver = void 0;
const MyEvent_1 = require("../entites/MyEvent");
const checkAdmin_1 = require("../middleware/checkAdmin");
const MyEventInput_1 = require("../types/input/MyEventInput");
const MyEventResponse_1 = require("../types/response/MyEventResponse");
const type_graphql_1 = require("type-graphql");
const data_source_1 = require("../data-source");
let MyEventResolver = class MyEventResolver {
    getEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const events = yield MyEvent_1.MyEvent.find();
                if (events) {
                    return {
                        code: 200,
                        success: true,
                        myEvents: events,
                    };
                }
                else {
                    return {
                        code: 400,
                        success: false,
                        message: "Not have any event",
                    };
                }
            }
            catch (error) {
                return {
                    code: 500,
                    success: false,
                    message: error.message,
                };
            }
        });
    }
    getEvent(title) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = yield MyEvent_1.MyEvent.findOne({
                    where: {
                        title: title
                    }
                });
                if (event) {
                    return {
                        code: 200,
                        success: true,
                        myEvent: event,
                    };
                }
                else {
                    return {
                        code: 400,
                        success: false,
                        message: "Not have any event",
                    };
                }
            }
            catch (error) {
                return {
                    code: 500,
                    success: false,
                    message: error.message,
                };
            }
        });
    }
    adminCreateEvent(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.dataSource.transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
                const { content, title, thumbnailForDesktop, thumbnailForMobile } = input;
                try {
                    const newEvent = transactionManager.create(MyEvent_1.MyEvent, {
                        content,
                        title,
                        thumbnailForDesktop,
                        thumbnailForMobile,
                    });
                    yield transactionManager.save(newEvent);
                    return {
                        code: 200,
                        success: true,
                        myEvent: newEvent
                    };
                }
                catch (error) {
                    return {
                        code: 500,
                        success: false,
                        message: error.message,
                    };
                }
            }));
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)((_return) => MyEventResponse_1.MyEventResponse),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MyEventResolver.prototype, "getEvents", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => MyEventResponse_1.MyEventResponse),
    __param(0, (0, type_graphql_1.Arg)("title")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MyEventResolver.prototype, "getEvent", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => MyEventResponse_1.MyEventResponse),
    (0, type_graphql_1.UseMiddleware)(checkAdmin_1.checkAdmin),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MyEventInput_1.MyEventInput]),
    __metadata("design:returntype", Promise)
], MyEventResolver.prototype, "adminCreateEvent", null);
MyEventResolver = __decorate([
    (0, type_graphql_1.Resolver)((_of) => MyEvent_1.MyEvent)
], MyEventResolver);
exports.MyEventResolver = MyEventResolver;
//# sourceMappingURL=MyEventResolver.js.map