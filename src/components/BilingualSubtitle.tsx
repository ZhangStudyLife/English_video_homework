import React from "react";
import { CinematicSubtitle } from "./Cinematic";

interface BilingualSubtitleProps {
  english: string;
  chinese: string;
}

export const BilingualSubtitle: React.FC<BilingualSubtitleProps> = ({
  english,
  chinese,
}) => <CinematicSubtitle english={english} chinese={chinese} />;
