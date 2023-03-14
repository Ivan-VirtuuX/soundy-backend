import mongoose from 'mongoose';

import { Unique } from 'typeorm';

export class CreateUserDto {
  _id: mongoose.Types.ObjectId;

  @Unique(['login'])
  login: string;

  password?: string;

  name: string;

  surname: string;

  birthDate: Date;
}
