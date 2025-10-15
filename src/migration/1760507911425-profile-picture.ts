import { MigrationInterface, QueryRunner } from "typeorm";

export class ProfilePicture1760507911425 implements MigrationInterface {
    name = 'ProfilePicture1760507911425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "profileImage" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profileImage"`);
    }

}
