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
  likes: User[];
  pinned: false;
  id: string;
}
