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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyEventResponse = void 0;
const type_graphql_1 = require("type-graphql");
const MyEvent_1 = require("../../entites/MyEvent");
const IResponse_1 = require("./IResponse");
let MyEventResponse = class MyEventResponse {
};
__decorate([
    (0, type_graphql_1.Field)(_return => MyEvent_1.MyEvent, { nullable: true }),
    __metadata("design:type", MyEvent_1.MyEvent)
], MyEventResponse.prototype, "myEvent", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => [MyEvent_1.MyEvent], { nullable: true }),
    __metadata("design:type", Array)
], MyEventResponse.prototype, "myEvents", void 0);
MyEventResponse = __decorate([
    (0, type_graphql_1.ObjectType)({ implements: IResponse_1.IResponse })
], MyEventResponse);
exports.MyEventResponse = MyEventResponse;
//# sourceMappingURL=MyEventResponse.js.map