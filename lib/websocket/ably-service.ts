import * as Ably from 'ably';
import { nanoid } from 'nanoid';

let ably: Ably.Realtime | null = null;

// Initialize Ably client
export function getAblyClient() {
  if (!ably) {
    const clientId = nanoid();
    ably = new Ably.Realtime({
      key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
      clientId,
    });
  }
  return ably;
}

// Create a channel for a specific conversation
export function getConversationChannel(conversationId: string) {
  const client = getAblyClient();
  return client.channels.get(`conversation:${conversationId}`);
}

// Publish code generation progress to a channel
export function publishCodeProgress(conversationId: string, data: any) {
  const channel = getConversationChannel(conversationId);
  return channel.publish('code-progress', data);
}

// Subscribe to code generation progress
export function subscribeToCodeProgress(conversationId: string, callback: (data: any) => void) {
  const channel = getConversationChannel(conversationId);
  channel.subscribe('code-progress', (message) => {
    callback(message.data);
  });
  
  return () => {
    channel.unsubscribe('code-progress');
  };
}

// Publish UI preview updates
export function publishPreviewUpdate(conversationId: string, data: any) {
  const channel = getConversationChannel(conversationId);
  return channel.publish('preview-update', data);
}

// Subscribe to UI preview updates
export function subscribeToPreviewUpdates(conversationId: string, callback: (data: any) => void) {
  const channel = getConversationChannel(conversationId);
  channel.subscribe('preview-update', (message) => {
    callback(message.data);
  });
  
  return () => {
    channel.unsubscribe('preview-update');
  };
}