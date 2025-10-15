import { MigrationInterface, QueryRunner } from "typeorm";

export class AppointmentLog1760504859379 implements MigrationInterface {
    name = 'AppointmentLog1760504859379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "appointment_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL, "remarks" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "appointmentId" integer, CONSTRAINT "PK_6cec5201edf8cab90b082d4e287" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "appointment_logs" ADD CONSTRAINT "FK_1a5a53b948ea288492ec51447ad" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment_logs" DROP CONSTRAINT "FK_1a5a53b948ea288492ec51447ad"`);
        await queryRunner.query(`DROP TABLE "appointment_logs"`);
    }

}
