export class AddCommentDto {
  postId: string;

  content: { text: string; images: string[] };
}
