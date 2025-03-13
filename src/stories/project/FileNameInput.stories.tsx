import type { Meta, StoryObj } from '@storybook/react';
import FileNameInput from '../../components/FileNameInput';
import { useState } from 'react';

const meta = {
  title: 'Project/FileNameInput',
  component: FileNameInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    onChange: { action: 'changed' },
    onEnter: { action: 'enter pressed' }
  },
} satisfies Meta<typeof FileNameInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic story with default props
export const Default: Story = {
  args: {
    value: 'image-name',
    onChange: (value: string) => console.log('Value changed:', value),
  },
};

// Interactive example that shows the component in action
export const Interactive: Story = {
  args: {
    value: 'my-photo',
    onChange: () => {},
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState('my-photo');
    
    const handleChange = (newValue: string) => {
      setValue(newValue);
    };
    
    const handleEnter = () => {
      alert(`Photo captured with name: ${value}`);
    };
    
    return (
      <div className="p-4 border rounded-md shadow-sm max-w-md">
        <h3 className="text-lg font-medium mb-2">Enter Filename</h3>
        <FileNameInput
          value={value}
          onChange={handleChange}
          onEnter={handleEnter}
        />
        <div className="mt-4 text-sm text-gray-500">
          Current value: <code>{value}</code>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Press Enter to capture photo
        </div>
      </div>
    );
  },
};
