import { IsArray } from 'class-validator';
import { User } from '@user/schemas/user.schema';

export interface OutputBlockData {
  id?: string;
  type: 'paragraph' | string;
  data: any;
}

export class CreatePostDto {
  @IsArray()
  body: OutputBlockData[];

  views: User[];

  likes: User[];

  id: string;
}
