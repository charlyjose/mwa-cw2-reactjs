export default function authHeader() {
  // const user = JSON.parse(localStorage.getItem('user'));
  
  // get access token from cookie
  const accessToken = document.cookie.split("accessToken=")[1];

  if (accessToken) {
    // return { 'x-access-token': user.accessToken };
    return { 'x-access-token': accessToken };
  } else {
    return {};
  }
}
