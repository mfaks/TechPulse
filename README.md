# TechPulse
Industry Tech News. All in one Place.

![techpulse_home](insert_screenshot_path_here)

## Introduction 🚀
TechPulse is your personalized gateway to the latest technology news and insights. We aggregate and curate news from leading tech companies, allowing you to stay informed about the tech topics and companies that matter most to you. Our AI-powered platform analyzes hundreds of articles daily to bring you the most relevant and impactful stories based on your interests.

## Features ✨
- **Customized News Feed**: Select your favorite tech topics and companies to create a personalized news stream
- **AI-Powered Summaries**: Get concise, intelligent summaries that highlight key technical details
- **Real-time Updates**: Stay current with the latest news from leading tech companies
- **OAuth Integration**: Seamless sign-in with GitHub and Google accounts
- **Interactive UI**: Modern, responsive interface with smooth animations and transitions
- **Company Insights**: Direct access to engineering blogs from 20+ leading tech companies

## Tech Stack 🛠️

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Socket.io

### Backend
- FastAPI
- Python
- Apache Kafka
- OpenAI
- DynamoDB
- Apache Airflow

### DevOps & Infrastructure
- Docker
- LocalStack
- PostgreSQL
- Zookeeper
- GitHub Actions

## Getting Started 🏁

1. Clone the repository
2. Set up environment variables:
3. Start the services using Docker Compose:

4. Access the application:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Airflow: http://localhost:8080

## Architecture Overview 🏗️

TechPulse uses a microservices architecture with the following key components:

- **Web Scraping Service**: Automated collection of tech news using Airflow
- **Query Service**: Handles data retrieval and filtering
- **OpenAI Service**: Processes and summarizes articles
- **Real-time Updates**: WebSocket communication via Socket.io
- **Authentication**: OAuth 2.0 with GitHub and Google

## Contributing 🤝

We welcome contributions to TechPulse! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a pull request

## What's Next? 🚀

- **Additional News Sources**: Expand coverage to more tech companies (feel free to send me an email of a company that you want to see in TechPulse!)
- **User Preferences**: Save and manage multiple news feed configurations specific to each user
- **Mobile App**: Native mobile applications for iOS and Android to get your news on the go
- **Analytics Dashboard**: Track reading habits and popular topics 

## License 📜

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact 📧

For questions or support, please reach out to the project maintainer:
- Muhammad Faks - [muhammad.faks@gmail.com]
