"use strict";
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
exports.initial1652261377811 = void 0;
class initial1652261377811 {
    constructor() {
        this.name = 'initial1652261377811';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "country" ("id" SERIAL NOT NULL, "countryName" character varying NOT NULL, "kindId" integer, CONSTRAINT "UQ_d170c76512626b32fbe1673305d" UNIQUE ("countryName"), CONSTRAINT "PK_bf6e37c231c4f4ea56dcd887269" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "product_kind" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_aa3c00b453ea773897dee44dcb2" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "product_class" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "kindId" integer, CONSTRAINT "PK_d59ae9c0bc6668d8eb4568f2e27" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "brand" ("id" SERIAL NOT NULL, "brandName" character varying NOT NULL, "thumbnail" character varying NOT NULL, "description" character varying, CONSTRAINT "UQ_abb84c510fd9e50b42a6c6d332c" UNIQUE ("brandName"), CONSTRAINT "PK_a5d20765ddd942eb5de4eee2d7f" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "price" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "price" integer NOT NULL, "salesPercent" integer NOT NULL DEFAULT '0', "status" integer NOT NULL, "isGift" boolean, "productId" integer, CONSTRAINT "PK_d163e55e8cce6908b2e0f27cea4" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "productName" character varying NOT NULL, "thumbnail" character varying NOT NULL, "imgDescription" text NOT NULL, "description" character varying NOT NULL, "salesPercent" integer NOT NULL DEFAULT '0', "priceToDisplay" integer NOT NULL, "sales" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "brandId" integer, "kindId" integer, "classId" integer, "countryId" integer, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "bill_product" ("id" SERIAL NOT NULL, "productName" character varying NOT NULL, "productThumbnail" character varying NOT NULL, "productType" character varying NOT NULL, "productPrice" integer NOT NULL, "productAmount" integer NOT NULL, "priceIdForLocal" integer, "countryNameForDeliveryPrice" character varying, "billId" integer, CONSTRAINT "PK_8f8fa9c4a20b839a9272d908b87" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "bill_cancel_reason" ("id" SERIAL NOT NULL, "reason" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "customerId" integer, CONSTRAINT "PK_c27a0ae1681cb46a99c212fbb94" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "customer" ("id" SERIAL NOT NULL, "customerName" character varying NOT NULL, "customerPhone" character varying NOT NULL, "city" character varying NOT NULL, "province" character varying NOT NULL, "address" character varying NOT NULL, "rejectedAmount" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TYPE "public"."bill_billstatus_enum" AS ENUM('Chờ xác nhận', 'Đã xác nhận', 'Đã đóng gói', 'Đang vận chuyển', 'Đã hoàn thành', 'Đã hủy')`);
            yield queryRunner.query(`CREATE TABLE "bill" ("id" SERIAL NOT NULL, "notice" character varying, "paymentType" character varying NOT NULL, "introduceCode" integer, "deliveryPrice" integer NOT NULL, "paymentDown" integer, "isCommented" boolean NOT NULL DEFAULT true, "billStatus" "public"."bill_billstatus_enum" NOT NULL DEFAULT 'Chờ xác nhận', "createdAt" date NOT NULL DEFAULT now(), "userId" integer, "customerId" integer, CONSTRAINT "PK_683b47912b8b30fe71d1fa22199" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "money_bonus" ("id" SERIAL NOT NULL, "moneyNumber" bigint NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_ba48ca981e7d4540b969c68069a" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "take_money_field" ("id" SERIAL NOT NULL, "accoutName" character varying NOT NULL, "accountNumber" character varying NOT NULL, "accountBankName" character varying NOT NULL, "cancelReason" character varying, "money" integer NOT NULL, "isSuccessImage" character varying, "status" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "UQ_07c25f9d4de7c542cbd7f46a391" UNIQUE ("accoutName"), CONSTRAINT "PK_febc355c3422e1ad8fd651ac9df" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "userId" character varying NOT NULL, "userAvatar" character varying NOT NULL, "userName" character varying NOT NULL, "introduceCode" integer NOT NULL, "paidAmount" integer NOT NULL DEFAULT '0', "isHidden" boolean NOT NULL DEFAULT false, "moneyDepot" integer NOT NULL DEFAULT '0', "createdAt" date NOT NULL DEFAULT now(), CONSTRAINT "UQ_d72ea127f30e21753c9e229891e" UNIQUE ("userId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "user_comment" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "rating" integer NOT NULL, "isFeedback" boolean NOT NULL DEFAULT false, "imagesComment" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "productId" integer, CONSTRAINT "PK_09bced71952353c5ae4e40f0f52" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "feedback" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "adminId" integer, "commentId" integer, CONSTRAINT "PK_8389f9e087a57689cd5be8b2b13" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "admin" ("id" SERIAL NOT NULL, "adminId" character varying NOT NULL, "adminName" character varying NOT NULL, "avatar" character varying NOT NULL, "adminType" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_abce4cc3fe598f242ab45e529b6" UNIQUE ("adminId"), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "my_event" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "thumbnail" character varying NOT NULL, "instructionImages" text, "summary" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c74a63ded281c323311482d0b5f" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "brand_product_classes_product_class" ("brandId" integer NOT NULL, "productClassId" integer NOT NULL, CONSTRAINT "PK_53e590b1902545891032974cfd3" PRIMARY KEY ("brandId", "productClassId"))`);
            yield queryRunner.query(`CREATE INDEX "IDX_1dfb4ee7659610313f642eb177" ON "brand_product_classes_product_class" ("brandId") `);
            yield queryRunner.query(`CREATE INDEX "IDX_0640b42721e98dcaf86fe052d2" ON "brand_product_classes_product_class" ("productClassId") `);
            yield queryRunner.query(`ALTER TABLE "country" ADD CONSTRAINT "FK_03d7c6aa83ad76418a1ecc8314a" FOREIGN KEY ("kindId") REFERENCES "product_kind"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "product_class" ADD CONSTRAINT "FK_cc1d92d1590379e0099adac553c" FOREIGN KEY ("kindId") REFERENCES "product_kind"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "price" ADD CONSTRAINT "FK_47d081ba217e201d4245e9d76d0" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_bb7d3d9dc1fae40293795ae39d6" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_a696a2d0e097dbcdd6929b0f0f3" FOREIGN KEY ("kindId") REFERENCES "product_kind"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_b60e3eb3807ba810ddff1ec39b4" FOREIGN KEY ("classId") REFERENCES "product_class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_7aa4c41cfe929a62d7953183451" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "bill_product" ADD CONSTRAINT "FK_688add6027ecbe57ef99ce0c1f7" FOREIGN KEY ("billId") REFERENCES "bill"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "bill_cancel_reason" ADD CONSTRAINT "FK_050d29ccdb4587b9f58c6e7f2f0" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "bill" ADD CONSTRAINT "FK_275fe11db713fd6f9fd62709917" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "bill" ADD CONSTRAINT "FK_8283ffb2d90b494882adece3f3c" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "money_bonus" ADD CONSTRAINT "FK_ee464ddb16cd704b4119d91661b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "take_money_field" ADD CONSTRAINT "FK_86d48c3bc5174dbd8e70fbaed44" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "user_comment" ADD CONSTRAINT "FK_ebd475b57b16b0039934dc31a14" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "user_comment" ADD CONSTRAINT "FK_e79a970abccb687faf54c3074cb" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "feedback" ADD CONSTRAINT "FK_c9fc883ad036f1919938a554b77" FOREIGN KEY ("adminId") REFERENCES "admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "feedback" ADD CONSTRAINT "FK_e179b1dc181beda347cff12a4cc" FOREIGN KEY ("commentId") REFERENCES "user_comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "brand_product_classes_product_class" ADD CONSTRAINT "FK_1dfb4ee7659610313f642eb177d" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
            yield queryRunner.query(`ALTER TABLE "brand_product_classes_product_class" ADD CONSTRAINT "FK_0640b42721e98dcaf86fe052d24" FOREIGN KEY ("productClassId") REFERENCES "product_class"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "brand_product_classes_product_class" DROP CONSTRAINT "FK_0640b42721e98dcaf86fe052d24"`);
            yield queryRunner.query(`ALTER TABLE "brand_product_classes_product_class" DROP CONSTRAINT "FK_1dfb4ee7659610313f642eb177d"`);
            yield queryRunner.query(`ALTER TABLE "feedback" DROP CONSTRAINT "FK_e179b1dc181beda347cff12a4cc"`);
            yield queryRunner.query(`ALTER TABLE "feedback" DROP CONSTRAINT "FK_c9fc883ad036f1919938a554b77"`);
            yield queryRunner.query(`ALTER TABLE "user_comment" DROP CONSTRAINT "FK_e79a970abccb687faf54c3074cb"`);
            yield queryRunner.query(`ALTER TABLE "user_comment" DROP CONSTRAINT "FK_ebd475b57b16b0039934dc31a14"`);
            yield queryRunner.query(`ALTER TABLE "take_money_field" DROP CONSTRAINT "FK_86d48c3bc5174dbd8e70fbaed44"`);
            yield queryRunner.query(`ALTER TABLE "money_bonus" DROP CONSTRAINT "FK_ee464ddb16cd704b4119d91661b"`);
            yield queryRunner.query(`ALTER TABLE "bill" DROP CONSTRAINT "FK_8283ffb2d90b494882adece3f3c"`);
            yield queryRunner.query(`ALTER TABLE "bill" DROP CONSTRAINT "FK_275fe11db713fd6f9fd62709917"`);
            yield queryRunner.query(`ALTER TABLE "bill_cancel_reason" DROP CONSTRAINT "FK_050d29ccdb4587b9f58c6e7f2f0"`);
            yield queryRunner.query(`ALTER TABLE "bill_product" DROP CONSTRAINT "FK_688add6027ecbe57ef99ce0c1f7"`);
            yield queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_7aa4c41cfe929a62d7953183451"`);
            yield queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_b60e3eb3807ba810ddff1ec39b4"`);
            yield queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_a696a2d0e097dbcdd6929b0f0f3"`);
            yield queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_bb7d3d9dc1fae40293795ae39d6"`);
            yield queryRunner.query(`ALTER TABLE "price" DROP CONSTRAINT "FK_47d081ba217e201d4245e9d76d0"`);
            yield queryRunner.query(`ALTER TABLE "product_class" DROP CONSTRAINT "FK_cc1d92d1590379e0099adac553c"`);
            yield queryRunner.query(`ALTER TABLE "country" DROP CONSTRAINT "FK_03d7c6aa83ad76418a1ecc8314a"`);
            yield queryRunner.query(`DROP INDEX "public"."IDX_0640b42721e98dcaf86fe052d2"`);
            yield queryRunner.query(`DROP INDEX "public"."IDX_1dfb4ee7659610313f642eb177"`);
            yield queryRunner.query(`DROP TABLE "brand_product_classes_product_class"`);
            yield queryRunner.query(`DROP TABLE "my_event"`);
            yield queryRunner.query(`DROP TABLE "admin"`);
            yield queryRunner.query(`DROP TABLE "feedback"`);
            yield queryRunner.query(`DROP TABLE "user_comment"`);
            yield queryRunner.query(`DROP TABLE "user"`);
            yield queryRunner.query(`DROP TABLE "take_money_field"`);
            yield queryRunner.query(`DROP TABLE "money_bonus"`);
            yield queryRunner.query(`DROP TABLE "bill"`);
            yield queryRunner.query(`DROP TYPE "public"."bill_billstatus_enum"`);
            yield queryRunner.query(`DROP TABLE "customer"`);
            yield queryRunner.query(`DROP TABLE "bill_cancel_reason"`);
            yield queryRunner.query(`DROP TABLE "bill_product"`);
            yield queryRunner.query(`DROP TABLE "product"`);
            yield queryRunner.query(`DROP TABLE "price"`);
            yield queryRunner.query(`DROP TABLE "brand"`);
            yield queryRunner.query(`DROP TABLE "product_class"`);
            yield queryRunner.query(`DROP TABLE "product_kind"`);
            yield queryRunner.query(`DROP TABLE "country"`);
        });
    }
}
exports.initial1652261377811 = initial1652261377811;
//# sourceMappingURL=1652261377811-initial.js.map