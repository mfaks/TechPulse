export class KafkaConsumer {
    private socket: WebSocket | null = null;
    private isConnected: boolean = false;
    private onConnectCallbacks: (() => void)[] = [];
    private onDisconnectCallbacks: (() => void)[] = [];
    private onMessageCallbacks: ((data: any) => void)[] = [];
    private connectionAttempts: number = 0;
    private maxRetries: number = 3;

    public async initialize() {
        if (this.socket?.readyState === WebSocket.OPEN) {
            return;
        }
        await this.connect();
    }

    private async connect() {
        if (this.socket?.readyState === WebSocket.CONNECTING) {
            return;
        }
        
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const clientId = Date.now();
        const wsUrl = backendUrl.replace('http', 'ws') + `/ws/${clientId}`;

        try {
            this.socket = new WebSocket(wsUrl);
            this.setupEventListeners();
        } catch (error) {
            console.error("WebSocket connection failed:", error);
            this.handleConnectionFailure();
        }
    }

    private setupEventListeners() {
        if (!this.socket) return;

        this.socket.onopen = () => {
            this.isConnected = true;
            this.connectionAttempts = 0;
            this.onConnectCallbacks.forEach(callback => callback());
        };

        this.socket.onclose = () => {
            this.isConnected = false;
            this.onDisconnectCallbacks.forEach(callback => callback());
            this.handleConnectionFailure();
        };

        this.socket.onmessage = (event) => {
            this.onMessageCallbacks.forEach(callback => {
                try {
                    callback(event.data);
                } catch (error) {
                    console.error("Error in message callback:", error);
                }
            });
        };
    }

    public on(event: 'connect' | 'disconnect' | 'message', callback: (data?: any) => void) {
        switch (event) {
            case 'connect':
                this.onConnectCallbacks.push(callback);
                if (this.isConnected) callback();
                break;
            case 'disconnect':
                this.onDisconnectCallbacks.push(callback);
                break;
            case 'message':
                this.onMessageCallbacks.push(callback);
                break;
        }
    }

    public sendMessage(message: string) {
        if (this.socket && this.isConnected) {
            this.socket.send(message);
        }
    }

    public async disconnect() {
        if (this.socket) {
            await this.closeExistingConnection();
            this.socket = null;
        }
        this.isConnected = false;
    }

    private async closeExistingConnection(): Promise<void> {
        return new Promise((resolve) => {
            if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
                resolve();
                return;
            }
            this.socket.addEventListener('close', () => resolve());
            this.socket.close();
        });
    }

    private handleConnectionFailure() {
        if (this.connectionAttempts < this.maxRetries) {
            this.connectionAttempts++;
            setTimeout(() => this.connect(), 1000 * this.connectionAttempts);
        }
    }
}