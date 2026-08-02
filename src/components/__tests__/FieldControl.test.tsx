import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { FieldControl } from '../FieldControl';

describe('FieldControl', () => {
  it('renders a text input by default', () => {
    const handleChange = vi.fn();
    render(<FieldControl value="test" onChange={handleChange} label="Name" placeholder="Enter name" />);
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    
    const input = screen.getByPlaceholderText('Enter name');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveValue('test');
  });

  it('calls onChange when typing in text input', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(<FieldControl value="" onChange={handleChange} placeholder="Enter name" />);
    
    const input = screen.getByPlaceholderText('Enter name');
    await user.type(input, 'a');
    
    expect(handleChange).toHaveBeenCalledWith('a');
  });

  it('renders a textarea', () => {
    const handleChange = vi.fn();
    render(<FieldControl type="textarea" value="long text" onChange={handleChange} placeholder="Bio" />);
    
    const textarea = screen.getByPlaceholderText('Bio');
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveValue('long text');
  });

  it('renders a select dropdown', () => {
    const handleChange = vi.fn();
    const options = [
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' },
    ];
    
    render(
      <FieldControl 
        type="select" 
        value="opt1" 
        onChange={handleChange} 
        options={options} 
        placeholder="Choose..."
      />
    );
    
    // placeholder becomes a disabled option
    expect(screen.getByText('Choose...')).toBeDisabled();
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('renders a range input', () => {
    const handleChange = vi.fn();
    
    render(
      <FieldControl 
        type="range" 
        value={50} 
        onChange={handleChange} 
        min={0} 
        max={100}
        label="Volume"
        description="%"
      />
    );
    
    // Label should include the value and description
    expect(screen.getByText('Volume')).toBeInTheDocument();
    expect(screen.getByText('50 %')).toBeInTheDocument();
    
    const input = screen.getByRole('slider');
    expect(input).toHaveAttribute('type', 'range');
    expect(input).toHaveValue('50');
  });
});
