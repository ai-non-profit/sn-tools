import React, { useRef, useEffect, useState } from 'react';
import { Box } from '@mui/material';

const videos = [
  'https://v16-webapp-prime.tiktok.com/video/tos/alisg/tos-alisg-pve-0037/okDbTcfjgAXfQFCEAp5CAcokEEIDeQVArIwo7r/?a=1988&bti=ODszNWYuMDE6&ch=0&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C&cv=1&br=1816&bt=908&cs=0&ds=6&ft=-Csk_m7nPD12N1WW3h-UxtvFbY6e3wv25NcAp&mime_type=video_mp4&qs=0&rc=PGlkOGk3OjU0NzVpaDU1NUBpM2UzdHY5cnF5MzMzODgzNEBiNGNgYjFeX2IxLl4yLjY2YSNtNWhqMmQ0ZTFhLS1kLzFzcw%3D%3D&btag=e000b0000&expire=1748164712&l=20250523171821F9C2C8B775AD371609BE&ply_type=2&policy=2&signature=3a2b2c9fcfd6fcc6c1850e7d0e28e404&tk=tt_chain_token',
];

const VideoSlide = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  return (
    <Box
      ref={containerRef}
      sx={{
        height: '100vh',
        scrollSnapAlign: 'start',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <video controls autoPlay ref={videoRef} height="640" >
        <source src={`stream://video/${atob(src)}`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </Box>
  );
};

type Props = {
  videos: string[];
};

const VerticalVideoSlider = ({ videos }: Props) => {
  console.log('VerticalVideoSlider');

  return (
    <Box>
      {videos.map((src, index) => (
        <VideoSlide key={index} src={src} />
      ))}
    </Box>
  );
};

export default VerticalVideoSlider;
