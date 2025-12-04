import { Request, Response } from 'express';

// Get public health information
export const getHealthInfo = async (_req: Request, res: Response): Promise<void> => {
  try {
    const healthInfo = {
      title: 'Public Health Information',
      sections: [
        {
          title: 'COVID-19 Updates',
          content: 'Stay informed about the latest COVID-19 guidelines and vaccination information.',
          link: '#',
        },
        {
          title: 'Seasonal Flu Prevention',
          content: 'Learn about steps you can take to prevent the seasonal flu and when to get vaccinated.',
          link: '#',
        },
        {
          title: 'Mental Health Awareness',
          content: 'Explore resources and support options for maintaining good mental health.',
          link: '#',
        },
      ],
      privacyPolicy: {
        title: 'Privacy Policy',
        content:
          'We are committed to protecting your health information in compliance with HIPAA regulations. Your data is encrypted and only accessible to authorized healthcare providers.',
        lastUpdated: '2025-01-01',
      },
    };

    res.status(200).json(healthInfo);
  } catch (error) {
    console.error('Get health info error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch health information' } });
  }
};
