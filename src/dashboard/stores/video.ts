import { create } from 'zustand';

interface State {
  videos: Record<string, any>[];
  index: number;
  setIndex: (index: number) => void;
  setVideos: (videos: Record<string, any>[]) => void;
  changeVideo: (index: number, video: Partial<State['videos'][0]>) => void;
}

export const useVideoStore = create<State>(set => ({
  videos: [],
  index: 0,
  setIndex: (index: number) => set({index}),
  setVideos: (videos: Record<string, any>[]) => set({videos}),
  changeVideo: (index: number, video: Partial<State['videos'][0]>) => set(state => {
    for (const key in video) {
      state.videos[index][key] = video[key];
    }
    return {videos: [...state.videos]};
  }),
}));