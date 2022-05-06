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
exports.UserComment = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Feedback_1 = require("./Feedback");
const Product_1 = require("./Product");
const User_1 = require("./User");
let UserComment = class UserComment extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserComment.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserComment.prototype, "content", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserComment.prototype, "rating", void 0);
__decorate([
    (0, type_graphql_1.Field)({ defaultValue: false }),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], UserComment.prototype, "isFeedback", void 0);
__decorate([
    (0, type_graphql_1.Field)((_return) => [String], { nullable: true }),
    (0, typeorm_1.Column)("simple-array", { nullable: true }),
    __metadata("design:type", Array)
], UserComment.prototype, "imagesComment", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => [Feedback_1.Feedback], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => Feedback_1.Feedback, feedback => feedback.comment, { nullable: true }),
    __metadata("design:type", Array)
], UserComment.prototype, "feedbacks", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => User_1.User),
    (0, typeorm_1.ManyToOne)(() => User_1.User, user => user.comments),
    __metadata("design:type", User_1.User)
], UserComment.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.ManyToOne)(() => Product_1.Product, (product) => product.comments),
    __metadata("design:type", Product_1.Product)
], UserComment.prototype, "product", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserComment.prototype, "createdAt", void 0);
UserComment = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], UserComment);
exports.UserComment = UserComment;
//# sourceMappingURL=UserComment.js.map