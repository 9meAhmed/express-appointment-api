import { Repository } from "typeorm";
import { Patient } from "../entity/Patient";
import { User } from "../entity/User";

export class PatientService {
  constructor(private patientRepository: Repository<Patient>) {}

  async findAll(): Promise<Patient[]> {
    return this.patientRepository.find();
  }

  async findById(id: number): Promise<Patient | null> {
    return this.patientRepository.findOne({
      where: { id },
      relations: ["user"],
    });
  }
  async createPatient(patient: Patient): Promise<Patient> {
    if (!patient.user) {
      throw new Error("User is required");
    }

    const newPatient = this.patientRepository.create(patient);
    await this.patientRepository.save(newPatient);
    return newPatient;
  }

  async updatePatient(
    id: number,
    patientData: Partial<Patient>
  ): Promise<Patient | null> {
    const patient = await this.patientRepository.findOneBy({ id });
    if (!patient) return null;

    this.patientRepository.merge(patient, patientData);
    await this.patientRepository.save(patient);
    return patient;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.patientRepository.delete({ id });
    return result.affected !== 0;
  }
}
