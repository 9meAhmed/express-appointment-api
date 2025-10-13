import { MigrationInterface, QueryRunner } from "typeorm";

export class EmailVerification1759986551262 implements MigrationInterface {
    name = 'EmailVerification1759986551262'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "otpCode" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "otpCodeValidTill" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otpCodeValidTill"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otpCode"`);
    }

}
