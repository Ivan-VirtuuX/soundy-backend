export class AddCommentDto {
  content: { text: string; images: string[] };

  postId: string;
}
