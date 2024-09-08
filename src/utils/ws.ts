class WebSocketManager {
  public url: string;
  public ws: WebSocket | null = null;
  private listeners: Record<string, ((...args: any[]) => void)[]> = {};
  private reconnectInterval: number = 5000;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;

  constructor(wsPath: string) {
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsHost = window.location.host.replace("3000", "4000");
    const wsUrl = `${wsProtocol}//${wsHost}${wsPath}`;
    this.url = wsUrl;
  }

  connect() {
    if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log("WebSocket connection opened.");
        this.listeners["open"]?.forEach((cb) => cb());
        this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
      };

      this.ws.onmessage = (event: MessageEvent) => {
        const message = JSON.parse(event.data);
        this.listeners["message"]?.forEach((cb) => cb(message));
      };

      this.ws.onclose = () => {
        console.log("WebSocket connection closed");
        this.listeners["close"]?.forEach((cb) => cb());
      };

      this.ws.onerror = (error: Event) => {
        console.error("WebSocket error:", error);
        // Prevent error from bubbling up and crashing the app
      };
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error("WebSocket connection not open.");
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: (...args: any[]) => void) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        (cb) => cb !== callback
      );
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => this.connect(), this.reconnectInterval);
      this.reconnectAttempts++;
      console.log(`Reconnection attempt ${this.reconnectAttempts}`);
    } else {
      console.log("Max reconnection attempts reached, giving up.");
    }
  }
}

export default WebSocketManager;
