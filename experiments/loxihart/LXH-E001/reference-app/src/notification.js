export async function notify(notificationClient, request, event) {
  try {
    await notificationClient.send({ requestId: request.id, state: request.state, event });
    return { request, notification: 'SENT' };
  } catch (error) {
    return { request, notification: 'FAILED', error: String(error?.message ?? error) };
  }
}
