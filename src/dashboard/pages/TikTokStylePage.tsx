import React from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

function VideoBox({ url }: { url: string }) {
  const encodeUrl = btoa(url);
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <video
        key={encodeUrl}
        controls
        autoPlay
        style={{
          maxHeight: "660px",
          objectFit: "contain",
        }}
      >
        <source
          src={`stream://video/${encodeUrl}`}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </Box>
  );
}

type Props = {
  videos: Record<string, any>[];
  index?: number;
};

const TikTokStylePage = ({ videos, index = 0 }: Props) => {

  const [currentIndex, setCurrentIndex] = React.useState(index);
  const [video, setVideo] = React.useState(videos[index]);

  React.useEffect(() => {
    console.log(video)
  }, [video]);

  const changeIndex = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= videos.length) {
      return;
    }
    setCurrentIndex(newIndex);
    setVideo(videos[newIndex]);
  };

  return (
    <Box sx={{ display: "flex", height: "100%", backgroundColor: "#000" }}>
      {/* Left side: Video + UI */}
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", position: "relative", backgroundColor: "#242C33" }}>
        <Box sx={{ position: "absolute", top: '50%', right: 10, zIndex: 1 }}>
          <IconButton sx={{ color: "white", backgroundColor: "rgba(255, 255, 255, 0.1)" }} onClick={() => changeIndex(currentIndex - 1)}>
            <ArrowDropUpIcon />
          </IconButton>
        </Box>
        <Box sx={{ position: "absolute", top: '60%', right: 10, zIndex: 1 }}>
          <IconButton sx={{ color: "white", backgroundColor: "rgba(255, 255, 255, 0.1)" }} onClick={() => changeIndex(currentIndex + 1)}>
            <ArrowDropDownIcon />
          </IconButton>
        </Box>
        <VideoBox url={video.video.playAddr ?? video.video.downloadAddr} />
      </Box>

      {/* Right side: Metadata */}
      <Box sx={{ width: 300, color: "white", padding: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
          <Avatar alt="emoji_battery_app68" src="" />
          <Box sx={{ marginLeft: 2 }}>
            <Typography variant="subtitle1">N/A</Typography>
            <Typography variant="body2">N/A</Typography>
          </Box>
        </Box>

        <Typography variant="body2" paragraph>
          {video?.desc || "No description available."}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, marginBottom: 2, '& button': { fontSize: 15 } }}>
          <IconButton><FavoriteBorderIcon />{video.stats.diggCount}</IconButton>
          <IconButton><ChatBubbleOutlineIcon />{video.stats.commentCount}</IconButton>
          <IconButton><ShareIcon />{video.stats.shareCount}</IconButton>
        </Box>

        {/* <TextField
          variant="outlined"
          placeholder="Find related content"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        /> */}
      </Box>
    </Box >
  );
};

export default TikTokStylePage;
