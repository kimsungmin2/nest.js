interface Data {
  refreshToken: number;
  accessToken: number;
}

export const jwtData: Data = {
  refreshToken: 60 * 60 * 24 * 7,
  accessToken: 60 * 30,
};
