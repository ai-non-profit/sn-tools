import React, { useRef } from 'react';
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { IPCEvent } from 'src/util/constant';
import { TranscriptRequest } from 'src/util/dto';
import { useVideoStore } from 'src/dashboard/stores/video';
import Button from '@mui/material/Button';
import { formatViewCount } from 'src/util/common';
import { TikTokVideo } from 'src/api/dto/event';

function VideoBox({ url, videoRef }: { url: string; videoRef: React.RefObject<HTMLVideoElement> }) {
  const encodeUrl = btoa(url);
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <video
        ref={videoRef}
        key={encodeUrl}
        controls
        autoPlay
        style={{
          maxHeight: '660px',
          objectFit: 'contain',
        }}
      >
        <source
          src={url.startsWith('http') ? `stream://video/${encodeUrl}` : `file://${url}`}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </Box>
  );
}

function formatTimeRange({ start_time, end_time }: { start_time: number; end_time: number }): string {
  const format = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return `${format(start_time)}-${format(end_time)}`;
}

const TikTokStylePage = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const video: TikTokVideo = useVideoStore(state => state.videos[state.index]);
  const index = useVideoStore(state => state.index);
  const setIndex = useVideoStore(state => state.setIndex);
  const changeVideo = useVideoStore(state => state.changeVideo);
  const [url, setUrl] = React.useState<string>(video.localPath.original ?? video.video.playAddr ?? video.video.downloadAddr);
  const [isOutro, setIsOutro] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (video?.transcript?.length) return;
    window.electronAPI.invokeMain<TranscriptRequest, any>(
      IPCEvent.GET_TRANSCRIPT,
      { videoId: video.id, musicURL: video.music.playUrl, creatorId: video.author.id }
    ).then(res => {
      if (!res || !res.success) return;
      changeVideo(index, { transcript: res.data });
    });
  }, [video]);

  const changeIndex = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= useVideoStore.getState().videos.length) return;
    setIndex(newIndex);
  };

  const setOutroTime = () => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;
    changeVideo(index, {
      startOutro: currentTime,
    });
  };

  const viewOutro = () => {
    setUrl(video.localPath.outro);
    setIsOutro(true);
  };

  const viewOriginal = () => {
    setUrl(video.localPath.original ?? video.video.playAddr ?? video.video.downloadAddr);
    setIsOutro(false);
  };

  return (
    <Box sx={{ display: 'flex', height: '100%', backgroundColor: '#000' }}>
      {/* Left side: Video + UI */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: '#242C33'
      }}>
        <Box sx={{ position: 'absolute', top: '50%', right: 10, zIndex: 1 }}>
          <IconButton sx={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            onClick={() => changeIndex(index - 1)}>
            <ArrowDropUpIcon />
          </IconButton>
        </Box>
        <Box sx={{ position: 'absolute', top: '60%', right: 10, zIndex: 1 }}>
          <IconButton sx={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            onClick={() => changeIndex(index + 1)}>
            <ArrowDropDownIcon />
          </IconButton>
        </Box>
        <VideoBox url={url} videoRef={videoRef} />
      </Box>

      {/* Right side: Metadata */}
      <Box sx={{ width: 300, color: 'white', padding: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
          <Avatar alt="emoji_battery_app68"
            src="https://p9-sign-sg.tiktokcdn.com/tos-alisg-avt-0068/8f00348ad4c5aa957d99589893600e62~tplv-tiktokx-cropcenter:100:100.jpeg?dr=14579&refresh_token=2215cd8f&x-expires=1748232000&x-signature=snpeDM72y%2FaOvxVLPoCoeEbgUm8%3D&t=4d5b0474&ps=13740610&shp=a5d48078&shcp=b59d6b55&idc=my2" />
          <Box sx={{ marginLeft: 2 }}>
            <Typography variant="subtitle1">{video.author.uniqueId}</Typography>
            <Typography variant="body2">{video.author.signature}</Typography>
          </Box>
        </Box>

        <Typography variant="body2" paragraph>
          {video?.desc || 'No description available.'}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, marginBottom: 2, '& button': { fontSize: 15 } }}>
          <IconButton><FavoriteBorderIcon />{formatViewCount(video.stats.diggCount)}</IconButton>
          <IconButton><ChatBubbleOutlineIcon />{formatViewCount(video.stats.commentCount)}</IconButton>
          <IconButton><ShareIcon />{formatViewCount(video.stats.shareCount)}</IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, marginBottom: 2, '& button': { fontSize: 15 } }}>
          <Typography variant="subtitle1">{video.startOutro ?? '0'}</Typography>
          <Button variant='contained' onClick={setOutroTime} >Set Outro Time</Button>
        </Box>

        {video.localPath.outro && !isOutro && (
          <Box sx={{ display: 'flex', gap: 1, marginBottom: 2, '& button': { fontSize: 15 } }}>
            <Button variant='contained' onClick={viewOutro} >View Outro</Button>
          </Box>
        )}
        {isOutro && (
          <Box sx={{ display: 'flex', gap: 1, marginBottom: 2, '& button': { fontSize: 15 } }}>
            <Button variant='contained' onClick={viewOriginal} >View Origin</Button>
          </Box>
        )}

        <Typography variant="subtitle1">Transcript</Typography>
        <Box sx={{
          display: 'flex', flexDirection: 'column', gap: 1, marginBottom: 2, maxHeight: 300,
          overflowY: 'auto'
        }}>
          {video?.transcript?.map((item: any, index: number) => (
            <Box key={index} sx={{ backgroundColor: '#2C2F33', padding: 1, borderRadius: 1 }}>
              <Typography variant="body2">{formatTimeRange(item)}: {item.text} </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default TikTokStylePage;
