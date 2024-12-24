class Categories:
    @staticmethod
    def get_categories():
        return {
            'Backend and Infrastructure': [
                'backend', 'infrastructure', 'server', 'database', 'api', 
                'microservices', 'architecture', 'cloud infrastructure', 'kafka',
                'kubernetes', 'docker', 'devops', 'scalability', 'performance'
            ],
            'AI and Machine Learning': [
                'artificial intelligence', 'machine learning', 'machine', 'neural network', 
                'deep learning', 'ai', 'natural language processing', 'search', 
                'computer vision', 'generative ai', 'predictive analytics', 'ML',
                'reinforcement learning', 'data science', 'predictive', 'series'
            ],
            'Web and MobileDevelopment': [
                'mobile', 'web', 'frontend', 'full stack', 
                'javascript', 'react', 'angular', 'vue', 'html', 'css',
                'swiftui', 'android', 'swift', 'flutter', 'ios', 'mobile development',
            ],
            'Cloud Computing and DevOps': [
                'cloud', 'devops', 'aws', 'azure', 'gcp', 'ci/cd', 
                'infrastructure as code', 'automation', 'monitoring'
            ],
            'Data Engineering and Analytics': [
                'data engineering', 'data analytics', 'big data', 'data lakes', 
                'data warehousing', 'etl', 'data pipelines', 'queries', 'SQL',
                'data', 'data science', 'analytics', 'data warehouse', 'data modeling',
            ],
            'Security and Privacy': [
                'security', 'privacy', 'compliance', 'gdpr', 'data protection',
                'encryption', 'authentication', 'vulnerability', 'cybersecurity', 
                'data protection', 'compliance', 'threat detection', 'incident response'
            ]
        }
        
    @staticmethod
    def classify_article(title, additional_text=None):
        categories = Categories.get_categories()
        text = title.lower()
        if additional_text:
            if isinstance(additional_text, list):
                text += ' ' + ' '.join(additional_text).lower()
            else:
                text += ' ' + str(additional_text).lower()
                
        matched_categories = []
        for category, keywords in categories.items():
            if any(keyword in text for keyword in keywords):
                matched_categories.append(category)
        return matched_categories if matched_categories else ['Other']
