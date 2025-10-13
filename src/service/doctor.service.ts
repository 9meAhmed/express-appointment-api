import { Repository } from "typeorm";
import { Doctor } from "../entity/Doctor";
import { User } from "../entity/User";

export class DoctorService {
  constructor(private doctorRepository: Repository<Doctor>) {}

  async findAll(): Promise<Doctor[]> {
    return this.doctorRepository.find();
  }

  async findById(id: number): Promise<Doctor | null> {
    return this.doctorRepository.findOne({
      where: { id },
      relations: ["user"],
    });
  }

  async createDoctor(doctor: Doctor): Promise<Doctor> {
    const newDoctor = this.doctorRepository.create(doctor);
    await this.doctorRepository.save(newDoctor);
    return newDoctor;
  }

  async updateDoctor(
    id: number,
    doctorData: Partial<Doctor>
  ): Promise<Doctor | null> {
    const doctor = await this.doctorRepository.findOneBy({ id });
    if (!doctor) return null;

    this.doctorRepository.merge(doctor, doctorData);
    await this.doctorRepository.save(doctor);
    return doctor;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.doctorRepository.delete({ id });
    return result.affected !== 0;
  }
}
