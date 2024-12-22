import { Terminal, Brain, Smartphone, Cloud, Database, Shield } from "lucide-react";

export type Topic = {
    icon: typeof Terminal;
    title: string;
    image: string;
};
const topics: Topic[] = [
    { icon: Brain, title: "AI and Machine Learning", image: "/ai_ml.jpg" },
    { icon: Terminal, title: "Backend and Infrastructure", image: "/backend.jpeg" },
    { icon: Smartphone, title: "Web and Mobile Development", image: "/web_mobile.jpg" },
    { icon: Cloud, title: "Cloud Computing and DevOps", image: "/cloud.jpeg" },
    { icon: Database, title: "Data Engineering and Analytics", image: "/data_engineering_analytics.jpg" },
    { icon: Shield, title: "Security and Privacy", image: "/security_privacy.jpeg" }
];

export default topics;
