import type { Meta, StoryObj } from '@storybook/react';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { useState } from 'react';

const meta = {
  title: 'Project/ConfirmationDialog',
  component: ConfirmationDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    title: { control: 'text' },
    message: { control: 'text' },
    onConfirm: { action: 'confirmed' },
    onClose: { action: 'closed' }
  },
} satisfies Meta<typeof ConfirmationDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with the dialog open
export const Open: Story = {
  args: {
    isOpen: true,
    title: 'Confirm Action',
    message: 'Are you sure you want to perform this action? This cannot be undone.',
    onConfirm: () => console.log('Confirmed'),
    onClose: () => console.log('Closed')
  },
};

// Interactive example that allows toggling the dialog
export const Interactive: Story = {
  args: {
    isOpen: false,
    title: 'Confirm Action',
    message: 'Are you sure you want to perform this action?',
    onConfirm: () => {},
    onClose: () => {}
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isOpen, setIsOpen] = useState(false);
    
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const handleConfirm = () => {
      console.log('Action confirmed');
      setIsOpen(false);
    };
    
    return (
      <div className="p-4">
        <button 
          onClick={handleOpen}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Open Dialog
        </button>
        
        <ConfirmationDialog
          isOpen={isOpen}
          title={args.title || 'Confirm Action'}
          message={args.message || 'Are you sure you want to perform this action?'}
          onConfirm={handleConfirm}
          onClose={handleClose}
        />
      </div>
    );
  },
};
