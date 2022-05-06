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
exports.PaginationUsersResponse = void 0;
const type_graphql_1 = require("type-graphql");
const IResponse_1 = require("./IResponse");
const User_1 = require("../../entites/User");
let PaginationUsersResponse = class PaginationUsersResponse {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], PaginationUsersResponse.prototype, "totalCount", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PaginationUsersResponse.prototype, "hasMore", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], PaginationUsersResponse.prototype, "cursor", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => [User_1.User], { nullable: true }),
    __metadata("design:type", Array)
], PaginationUsersResponse.prototype, "users", void 0);
PaginationUsersResponse = __decorate([
    (0, type_graphql_1.ObjectType)({ implements: IResponse_1.IResponse })
], PaginationUsersResponse);
exports.PaginationUsersResponse = PaginationUsersResponse;
//# sourceMappingURL=PaginationUsersResponse.js.map