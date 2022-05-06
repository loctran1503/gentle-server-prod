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
exports.Feedback = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Admin_1 = require("./Admin");
const UserComment_1 = require("./UserComment");
let Feedback = class Feedback extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Feedback.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Feedback.prototype, "content", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => Admin_1.Admin),
    (0, typeorm_1.ManyToOne)(() => Admin_1.Admin, admin => admin.feedbacks),
    __metadata("design:type", Admin_1.Admin)
], Feedback.prototype, "admin", void 0);
__decorate([
    (0, type_graphql_1.Field)(_return => [UserComment_1.UserComment]),
    (0, typeorm_1.ManyToOne)(() => UserComment_1.UserComment, comment => comment.feedbacks),
    __metadata("design:type", UserComment_1.UserComment)
], Feedback.prototype, "comment", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Feedback.prototype, "createdAt", void 0);
Feedback = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], Feedback);
exports.Feedback = Feedback;
//# sourceMappingURL=Feedback.js.map