export const getCookie = (name: string): string => {
  const cookieArray: Array<string> = document.cookie.split(';');
  const cookieArrayLength: number = cookieArray.length;
  const cookieName = `${name}=`;
  let cookie: string; 

  for (let i = 0; i < cookieArrayLength; i += 1) {
    cookie = cookieArray[i].replace(/^\s+/g, '');

    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }

  return '';
};

export const setCookie = (name: string, value: string, expireDays = 10, path = '/'): void => {
  const date: Date = new Date();
  date.setTime(date.getTime() + expireDays * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  const cpath = `; path=${path}`;
  document.cookie = `${name}=${value}; ${expires}${cpath}`;
};

export const deleteCookie = (name: string): void => {
  setCookie(name, '', -1);
};