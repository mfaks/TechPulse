import { Terminal, Brain, Smartphone, Cloud, Database, Shield } from "lucide-react";

export type Topic = {
    icon: typeof Terminal;
    title: string;
};

const topics: Topic[] = [
    { icon: Terminal, title: "Backend and Infrastructure" },
    { icon: Brain, title: "Artificial Intelligence and Machine Learning" },
    { icon: Smartphone, title: "Mobile and Web Development" },
    { icon: Cloud, title: "Cloud Computing and DevOps" },
    { icon: Database, title: "Data Engineering and Analytics" },
    { icon: Shield, title: "Security and Privacy" }
];

export default topics;
