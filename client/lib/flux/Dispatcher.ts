export class Dispatcher {
  private listeners: ((action: any) => void)[] = [];

  register(listener: (action: any) => void) {
    this.listeners.push(listener);
  }

  dispatch(action: any) {
    this.listeners.forEach((listener) => listener(action));
  }
}

export const AppDispatcher = new Dispatcher();
