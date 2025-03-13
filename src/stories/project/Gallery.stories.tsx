import type { Meta, StoryObj } from '@storybook/react';
import Gallery from '../../components/Gallery';
import { GalleryProvider } from '../../contexts/GalleryContext';

// Mock images for the gallery
const mockImages = [
  {
    id: '1',
    name: 'Sample Image 1',
    src: 'https://via.placeholder.com/300x300?text=Sample+Image+1',
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Sample Image 2',
    src: 'https://via.placeholder.com/300x300?text=Sample+Image+2',
    timestamp: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Sample Image with a very long name that should be truncated',
    src: 'https://via.placeholder.com/300x300?text=Sample+Image+3',
    timestamp: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Sample Image 4',
    src: 'https://via.placeholder.com/300x300?text=Sample+Image+4',
    timestamp: new Date().toISOString()
  }
];

// Mock localStorage for Storybook
if (typeof window !== 'undefined') {
  const originalGetItem = Storage.prototype.getItem;
  Storage.prototype.getItem = function(key) {
    if (key === 'web-camera-gallery') {
      return JSON.stringify(mockImages);
    }
    return originalGetItem.call(this, key);
  };
}

const meta = {
  title: 'Project/Gallery',
  component: Gallery,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <GalleryProvider>
        <Story />
      </GalleryProvider>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Gallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyGallery: Story = {
  decorators: [
    (Story) => {
      // Override localStorage for this specific story
      const originalGetItem = Storage.prototype.getItem;
      Storage.prototype.getItem = function(key) {
        if (key === 'web-camera-gallery') {
          return JSON.stringify([]);
        }
        return originalGetItem.call(this, key);
      };
      
      return (
        <GalleryProvider>
          <Story />
        </GalleryProvider>
      );
    },
  ],
};
