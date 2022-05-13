import { MigrationInterface, QueryRunner } from "typeorm";

export class initial1652437210259 implements MigrationInterface {
    name = 'initial1652437210259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "country" DROP CONSTRAINT "FK_10ba72c20d73407c7c304d7014d"`);
        await queryRunner.query(`CREATE TABLE "product_kind_countries_country" ("productKindId" integer NOT NULL, "countryId" integer NOT NULL, CONSTRAINT "PK_9f4d67b620a480ac26a11b58296" PRIMARY KEY ("productKindId", "countryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f9dd4e6f28a22d77d5bd6674a5" ON "product_kind_countries_country" ("productKindId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c77723e1ffb529aa6fd7279256" ON "product_kind_countries_country" ("countryId") `);
        await queryRunner.query(`ALTER TABLE "country" DROP COLUMN "kindsId"`);
        await queryRunner.query(`ALTER TABLE "product_kind_countries_country" ADD CONSTRAINT "FK_f9dd4e6f28a22d77d5bd6674a56" FOREIGN KEY ("productKindId") REFERENCES "product_kind"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_kind_countries_country" ADD CONSTRAINT "FK_c77723e1ffb529aa6fd72792569" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_kind_countries_country" DROP CONSTRAINT "FK_c77723e1ffb529aa6fd72792569"`);
        await queryRunner.query(`ALTER TABLE "product_kind_countries_country" DROP CONSTRAINT "FK_f9dd4e6f28a22d77d5bd6674a56"`);
        await queryRunner.query(`ALTER TABLE "country" ADD "kindsId" integer`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c77723e1ffb529aa6fd7279256"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f9dd4e6f28a22d77d5bd6674a5"`);
        await queryRunner.query(`DROP TABLE "product_kind_countries_country"`);
        await queryRunner.query(`ALTER TABLE "country" ADD CONSTRAINT "FK_10ba72c20d73407c7c304d7014d" FOREIGN KEY ("kindsId") REFERENCES "product_kind"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
