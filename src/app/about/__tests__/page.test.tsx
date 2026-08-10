import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AboutPage from '../page';

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} priority={undefined} fill={undefined} />;
  },
}));

// Mock the site config to avoid any external dependencies issues
vi.mock('@/lib/config', () => ({
  siteConfig: {
    name: 'Test Name',
    socials: {
      github: 'https://github.com/test',
      linkedin: 'https://linkedin.com/test',
    }
  }
}));

// Mock TechIcon component to avoid any complex SVG rendering issues
vi.mock('@/components/TechIcon', () => ({
  default: () => <span data-testid="tech-icon" />,
}));

describe('AboutPage', () => {
  it('renders the hero section with name and title', () => {
    render(<AboutPage />);
    
    expect(screen.getByRole('heading', { name: 'Jakeer Chilakala' })).toBeInTheDocument();
    expect(screen.getAllByText('Senior Software Engineer').length).toBeGreaterThan(0);
    
    // Check if the profile image is rendered
    const profileImg = screen.getByAltText('Jakeer Chilakala');
    expect(profileImg).toBeInTheDocument();
    expect(profileImg).toHaveAttribute('src', '/profile.JPG');
  });

  it('renders the experience section', () => {
    render(<AboutPage />);
    
    // Check section headings and company names
    expect(screen.getByRole('heading', { name: 'Experience' })).toBeInTheDocument();
    expect(screen.getAllByText(/Wells Fargo/i)[0]).toBeInTheDocument();
    expect(screen.getByText('Mphasis')).toBeInTheDocument();
  });

  it('renders the skills section with various categories', () => {
    render(<AboutPage />);
    
    expect(screen.getByRole('heading', { name: 'Skills' })).toBeInTheDocument();
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();
    expect(screen.getByText('Cloud & Tools')).toBeInTheDocument();
    
    // Check some specific skills
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Java')).toBeInTheDocument();
    expect(screen.getByText('Splunk')).toBeInTheDocument();
  });

  it('renders education, certifications, and awards', () => {
    render(<AboutPage />);
    
    expect(screen.getByRole('heading', { name: 'Education & Awards' })).toBeInTheDocument();
    
    // Education
    expect(screen.getByText('National Institute of Technology Karnataka')).toBeInTheDocument();
    expect(screen.getByText('BE - Mechanical Engineering')).toBeInTheDocument();
    
    // Certifications
    expect(screen.getByText('Certifications')).toBeInTheDocument();
    expect(screen.getByText(/Google Cloud Certified Cloud Digital Leader/i)).toBeInTheDocument();
    
    // Awards
    expect(screen.getByText('Team Spotlight Award')).toBeInTheDocument();
  });

  it('renders the connect CTA section', () => {
    render(<AboutPage />);
    
    expect(screen.getByText('Let’s connect')).toBeInTheDocument();
    
    const contactLink = screen.getByRole('link', { name: /Get in touch/i });
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute('href', 'mailto:jakeerchilakala@gmail.com');
  });
});
