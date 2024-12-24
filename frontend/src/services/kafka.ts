export class KafkaConsumer {
    private socket: WebSocket | null = null;
    private isConnected: boolean = false;
    private onConnectCallbacks: (() => void)[] = [];
    private onDisconnectCallbacks: (() => void)[] = [];
    private onMessageCallbacks: ((data: any) => void)[] = [];
    private connectionAttempts: number = 0;
    private maxRetries: number = 3;
    private retryDelay: number = 1000;
    private isConnecting: boolean = false;
    private shouldReconnect: boolean = true;

    public async initialize() {
        if (!this.isConnected && !this.isConnecting) {
            await this.connect();
        }
    }

    private async connect() {
        if (this.isConnecting) return;
        
        this.isConnecting = true;
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const clientId = Date.now();
        const wsUrl = `ws://${backendUrl.replace('http://', '')}/ws/${clientId}`;

        try {
            if (this.socket) {
                await this.closeExistingConnection();
            }

            this.socket = new WebSocket(wsUrl);
            this.setupEventListeners();
        } catch (error) {
            console.error("WebSocket connection failed:", error);
            this.handleConnectionFailure();
        } finally {
            this.isConnecting = false;
        }
    }

    private async closeExistingConnection(): Promise<void> {
        return new Promise((resolve) => {
            if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
                resolve();
                return;
            }

            const onClose = () => {
                this.socket?.removeEventListener('close', onClose);
                resolve();
            };

            this.socket.addEventListener('close', onClose);
            this.socket.close(1000, "Closing existing connection");
        });
    }

    private setupEventListeners() {
        if (!this.socket) return;

        this.socket.onopen = () => {
            this.isConnected = true;
            this.connectionAttempts = 0;
            this.shouldReconnect = true;
            this.onConnectCallbacks.forEach(callback => callback());
        };

        this.socket.onclose = (event) => {
            const wasConnected = this.isConnected;
            this.isConnected = false;
            
            if (wasConnected) {
                this.onDisconnectCallbacks.forEach(callback => callback());
            }

            if (event.code !== 1000 && this.shouldReconnect) {
                this.handleConnectionFailure();
            }
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

    private handleConnectionFailure() {
        if (!this.shouldReconnect) return;
        
        if (this.connectionAttempts < this.maxRetries) {
            this.connectionAttempts++;
            setTimeout(() => this.connect(), this.retryDelay * this.connectionAttempts);
        }
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
        this.shouldReconnect = false;
        if (this.socket) {
            await this.closeExistingConnection();
            this.socket = null;
        }
        this.isConnected = false;
        this.connectionAttempts = this.maxRetries;
    }
}