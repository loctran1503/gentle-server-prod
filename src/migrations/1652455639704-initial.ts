import { MigrationInterface, QueryRunner } from "typeorm";

export class initial1652455639704 implements MigrationInterface {
    name = 'initial1652455639704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "my_event" DROP COLUMN "summary"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "my_event" ADD "summary" character varying NOT NULL`);
    }

}
