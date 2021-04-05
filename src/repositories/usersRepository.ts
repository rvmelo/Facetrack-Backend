import { getMongoRepository, MongoRepository } from 'typeorm';
import User from '../models/User';

interface UserData {
  id: string;
  name: string;
}

class UsersRepository {
  private ormRepository: MongoRepository<User>;

  constructor() {
    this.ormRepository = getMongoRepository(User, 'mongo');
  }

  public async findOrCreate({ id, name }: UserData): Promise<User> {
    const foundUser = await this.ormRepository.findOne({
      where: { user_id: id },
    });

    if (!foundUser) {
      const user = this.ormRepository.create({ user_id: id, name });
      await this.ormRepository.save(user);
      return user;
    }

    return foundUser;
  }
}

export default UsersRepository;
