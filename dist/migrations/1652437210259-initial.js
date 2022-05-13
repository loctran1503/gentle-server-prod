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
exports.initial1652437210259 = void 0;
class initial1652437210259 {
    constructor() {
        this.name = 'initial1652437210259';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "country" DROP CONSTRAINT "FK_10ba72c20d73407c7c304d7014d"`);
            yield queryRunner.query(`CREATE TABLE "product_kind_countries_country" ("productKindId" integer NOT NULL, "countryId" integer NOT NULL, CONSTRAINT "PK_9f4d67b620a480ac26a11b58296" PRIMARY KEY ("productKindId", "countryId"))`);
            yield queryRunner.query(`CREATE INDEX "IDX_f9dd4e6f28a22d77d5bd6674a5" ON "product_kind_countries_country" ("productKindId") `);
            yield queryRunner.query(`CREATE INDEX "IDX_c77723e1ffb529aa6fd7279256" ON "product_kind_countries_country" ("countryId") `);
            yield queryRunner.query(`ALTER TABLE "country" DROP COLUMN "kindsId"`);
            yield queryRunner.query(`ALTER TABLE "product_kind_countries_country" ADD CONSTRAINT "FK_f9dd4e6f28a22d77d5bd6674a56" FOREIGN KEY ("productKindId") REFERENCES "product_kind"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
            yield queryRunner.query(`ALTER TABLE "product_kind_countries_country" ADD CONSTRAINT "FK_c77723e1ffb529aa6fd72792569" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "product_kind_countries_country" DROP CONSTRAINT "FK_c77723e1ffb529aa6fd72792569"`);
            yield queryRunner.query(`ALTER TABLE "product_kind_countries_country" DROP CONSTRAINT "FK_f9dd4e6f28a22d77d5bd6674a56"`);
            yield queryRunner.query(`ALTER TABLE "country" ADD "kindsId" integer`);
            yield queryRunner.query(`DROP INDEX "public"."IDX_c77723e1ffb529aa6fd7279256"`);
            yield queryRunner.query(`DROP INDEX "public"."IDX_f9dd4e6f28a22d77d5bd6674a5"`);
            yield queryRunner.query(`DROP TABLE "product_kind_countries_country"`);
            yield queryRunner.query(`ALTER TABLE "country" ADD CONSTRAINT "FK_10ba72c20d73407c7c304d7014d" FOREIGN KEY ("kindsId") REFERENCES "product_kind"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
}
exports.initial1652437210259 = initial1652437210259;
//# sourceMappingURL=1652437210259-initial.js.map