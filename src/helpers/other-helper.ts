export function isKeyboardEvent(
  event: React.MouseEvent | React.KeyboardEvent
): event is React.KeyboardEvent {
  return (event as React.KeyboardEvent).key !== undefined;
}
