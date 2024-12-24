import axios from 'axios';

export const axiosInstance = axios.create({
  // withCredentials: true, // 자격 증명 추가
  baseURL:
    process.env.NEXT_PUBLIC_API_DOMAIN || 'https://firmunity.vercel.app/',
});
