export class CreateMessageDto {
  conversationId: string;
  sender: string;
  content: { text: string; imageUrl: string };
  messageId: string;
}
