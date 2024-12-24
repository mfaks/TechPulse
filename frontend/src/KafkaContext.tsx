import { createContext, ReactNode, useContext, useEffect, useMemo } from "react";
import { KafkaConsumer } from "./services/kafka";

export const KafkaContext = createContext<KafkaConsumer | null>(null);

export function useKafka() {
  const context = useContext(KafkaContext);
  if (!context) {
    throw new Error('useKafka must be used within KafkaProvider');
  }
  return context;
}

export function KafkaProvider({ children }: { children: ReactNode }) {
  const consumer = useMemo(() => new KafkaConsumer(), []);

  useEffect(() => {
    consumer.initialize();
    return () => {
      consumer.disconnect();
    };
  }, [consumer]);

  return (
    <KafkaContext.Provider value={consumer}>
      {children}
    </KafkaContext.Provider>
  );
}
