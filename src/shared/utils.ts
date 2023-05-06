const MOBILE_BREAKPOINT = 720;

export const isMobile = (currentWidth: number) => {
  return currentWidth <= MOBILE_BREAKPOINT;
}

