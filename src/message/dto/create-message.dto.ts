export class CreateMessageDto {
  conversationId: string;
  sender: string;
  content: { text: string; images: string[] };
  messageId: string;
}
