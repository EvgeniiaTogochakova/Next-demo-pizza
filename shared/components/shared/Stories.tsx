'use client';

import { Api } from '@/shared/services/api-client';
import { TStory } from '@/shared/services/stories';
import React from 'react';
import { cn } from '@/shared/lib/utils';
import { X } from 'lucide-react';
import ReactStories from 'react-insta-stories';
import { Container } from './Container';

interface Props {
  className?: string;
}

export const Stories: React.FC<Props> = ({ className }) => {
  const [stories, setStories] = React.useState<TStory[]>([]);
  const [open, setOpen] = React.useState(false);
  const [selectedStory, setSelectedStory] = React.useState<TStory>();

  React.useEffect(() => {
    async function fetchStories() {
      const data = await Api.stories.getAll();
      setStories(data);
    }

    fetchStories();
  }, []);

  const onClickStory = (story: TStory) => {
    setSelectedStory(story);

    if (story.items.length > 0) {
      setOpen(true);
    }
  };

  return (
    <>
      <Container className={cn('flex items-center justify-between gap-2 my-10', className)}>
        {stories.length === 0 &&
          [...Array(6)].map((_, index) => (
            <div key={index} className="w-[200px] h-[250px] bg-gray-200 rounded-md animate-pulse" />
          ))}

        {stories.map((story) => (
          <img
            key={story.id}
            onClick={() => onClickStory(story)}
            className="rounded-md cursor-pointer"
            height={250}
            width={200}
            src={story.previewImageUrl}
          />
        ))}

        {open && (
          <div className="absolute left-0 top-0 w-full h-full bg-black/80 flex items-center justify-center z-30">
            <div className="relative" style={{ width: 520 }}>
              <button className="absolute -right-10 -top-5 z-30" onClick={() => setOpen(false)}>
                <X className="absolute top-0 right-0 w-8 h-8 text-white/50" />
              </button>

              <ReactStories
                onAllStoriesEnd={() => setOpen(false)}
                stories={selectedStory?.items.map((item) => ({ url: item.sourceUrl })) || []}
                defaultInterval={5000}
                width={520}
                height={800}
              />
            </div>
          </div>
        )}
      </Container>
    </>
  );
};
