export const getFallbackByTitle = (title = '') => {
  const cleanTitle = title.toLowerCase();

  if (cleanTitle.includes('ml') || cleanTitle.includes('machine')) return '/images/ml-bootcamp.png';
  if (cleanTitle.includes('ui') || cleanTitle.includes('ux')) return '/images/ui:ux-bootcamp.jpg';
  if (cleanTitle.includes('music')) return '/images/music-event.jpg';
  if (cleanTitle.includes('college') || cleanTitle.includes('fest')) return '/images/collage-event.png';
  if (cleanTitle.includes('javascript') || cleanTitle.includes('js')) return '/images/javaScript-bootcamp.webp';
  if (cleanTitle.includes('css')) return '/images/css-bootcamp.jpg';

  return '/images/AI-bootcamp.jpg';
};

export const getImageUrl = (bannerPath, title = '') => {
  if (!bannerPath) {
    return getFallbackByTitle(title);
  }

  if (bannerPath.startsWith('http://') || bannerPath.startsWith('https://')) {
    return bannerPath;
  }

  if (bannerPath.startsWith('/images/')) {
    return bannerPath;
  }

  const backendUrl = import.meta.env.VITE_API_URL || 'https://event-management-xnzi.onrender.com';
  const cleanPath = bannerPath.startsWith('/') ? bannerPath : `/${bannerPath}`;

  return `${backendUrl}${cleanPath}`;
};
