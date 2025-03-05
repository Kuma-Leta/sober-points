import userPlaceholder from "../assets/images/user.png";
import { API_URL } from "../constants/url";
import imagePlaceHolder from '../assets/images/img.png'
export const getProfilePicUrl = (imagePath) => {
  if (!imagePath) return userPlaceholder;
  return imagePath?.startsWith("http") ? imagePath : `${API_URL}/${imagePath}`;
};

export const getUrl = (path) => {
  if (!path) return imagePlaceHolder;
  return path?.startsWith("http") ? path : `${API_URL}/${path}`;
};

export const timeSince = (dateString) => {
  const now = new Date();
  const createdAt = new Date(dateString);
  const diffInMs = now - createdAt;

  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (weeks > 0) {
    return `Joined ${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else if (days > 0) {
    return `Joined ${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `Joined ${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `Joined ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return `Joined ${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }
};
