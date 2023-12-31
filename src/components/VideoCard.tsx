import styled from "@emotion/styled";
import {
  Box,
  Chip,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import Image from "next/image";
import defaultThumbnail from "../assets/images/thumbnail_default.jpg";
import React from "react";
import { CONTENT_SERVICE_URL } from "../../env.config";
import formattedDate from "../utils/formatDate";

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
  const srcImage = props.thumbnailUrl
    ? CONTENT_SERVICE_URL + props.thumbnailUrl
    : defaultThumbnail;
  return (
    <>
      <ListItemButtonWrapper>
        <ListItemIcon>
          <Image src={srcImage} alt={"card-img"} height={250} width={300} />
        </ListItemIcon>
        <ListItemText sx={{ rowGap: "1rem" }}>
          <TypoWrapper sx={{ display: "flex", gap: "1rem" }}>
            <Typography variant="h4">{props.title}</Typography>
            {props.transcodeDone && <Chip label="transcoded" color="success" />}
          </TypoWrapper>
          <TypoWrapper>
            <Typography variant="h6">{props.description}</Typography>
          </TypoWrapper>
          <TypoWrapper>
            <Typography variant="subtitle1">
              {formattedDate(props.createdAt)}
            </Typography>
          </TypoWrapper>
        </ListItemText>
      </ListItemButtonWrapper>
      <Divider />
    </>
  );
}

export default VideoCard;
