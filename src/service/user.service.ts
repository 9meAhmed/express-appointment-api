import { Repository } from "typeorm";
import { User } from "../entity/User";
import Encrypt from "../helpers/encrypt.helper";

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ["patient", "doctor"],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async createUser(user: User): Promise<User> {
    const payload = {
      ...user,
      password: await Encrypt.hashPassword(user.password),
    };

    const newUser = this.userRepository.create(payload);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) return null;

    this.userRepository.merge(user, userData);
    await this.userRepository.save(user);
    return user;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.userRepository.delete({ id });
    return result.affected !== 0;
  }
}
