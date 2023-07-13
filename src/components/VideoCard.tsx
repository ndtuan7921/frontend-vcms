import styled from "@emotion/styled";
import {
  Box,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React from "react";
import { CONTENT_SERVICE_URL } from "../../env.config";

const TypoWrapper = styled(Box)(({ theme }) => ({
  margin: "1rem 0",
}));

const ListItemButtonWrapper = styled(ListItemButton)(({ theme }) => ({
  columnGap: "3rem",
  width: "100%",
}));

export interface VideoCardProps {
  createdAt: string;
  description: string;
  filedId: string;
  fileName: string;
  id: string;
  thumbnailUrl: string;
  title: string;
  transcodeDone: boolean;
}

function VideoCard(props: VideoCardProps) {
  const srcImage = props.transcodeDone
    ? `${props.transcodeDone && CONTENT_SERVICE_URL + props.thumbnailUrl}`
    : "";
  return (
    <>
      <ListItemButtonWrapper>
        <ListItemIcon>
          <Image src={srcImage} alt={"card-img"} height={250} width={300} />
        </ListItemIcon>
        <ListItemText sx={{ rowGap: "1rem" }}>
          <TypoWrapper>
            <Typography variant="h4">{props.title}</Typography>
          </TypoWrapper>
          <TypoWrapper>
            <Typography variant="h6">{props.description}</Typography>
          </TypoWrapper>
          <TypoWrapper>
            <Typography variant="subtitle1">{props.createdAt}</Typography>
          </TypoWrapper>
        </ListItemText>
      </ListItemButtonWrapper>
      <Divider />
    </>
  );
}

export default VideoCard;
