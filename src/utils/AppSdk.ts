/* eslint-disable @typescript-eslint/no-explicit-any */

import { signOut } from 'next-auth/react';

const handleAuthError = (status: number) => {
  if (status === 401 || status === 403) {
    signOut({ callbackUrl: '/login' });
  }
};

export const AppSdk = {
  getData: (url: string, body: any) => {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const options: any = {
          method: 'GET',
        };
        if (body && Object.keys(body).length > 0)
          options.body = JSON.stringify(body);
        //console.log(url, options);
        const res = await fetch(url, options);

        if (res.status === 401 || res.status === 403) {
          handleAuthError(res.status);
          return resolve({ error: 'Session expired. Redirecting to login...' });
        }

        if (res.ok) {
          const result = await res.json();
          return resolve(result as any);
        } else {
          return reject((await res.json()) as any);
        }
      } catch (e) {
        console.log(e);
        return reject(e as any);
      }
    });
  },
  postData: (url: string, data: any) => {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (res.status === 401 || res.status === 403) {
          handleAuthError(res.status);
          return resolve({ error: 'Session expired. Redirecting to login...' });
        }

        if (res.ok) {
          const result = await res.json();
          return resolve(result);
        } else {
          return reject((await res.json()) as any);
        }
      } catch (e) {
        console.log(e);
        return reject(e as any);
      }
    });
  },
  putData: (url: string, data: any) => {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const res = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (res.status === 401 || res.status === 403) {
          handleAuthError(res.status);
          return resolve({ error: 'Session expired. Redirecting to login...' });
        }

        // console.log(await res.json());
        if (res.ok) {
          const result = await res.json();
          return resolve(result);
        } else {
          return reject(res.status as any);
        }
      } catch (e) {
        console.log(e);
        return reject(e as any);
      }
    });
  },
  patchData: (url: string, data: any) => {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const res = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (res.status === 401 || res.status === 403) {
          handleAuthError(res.status);
          return resolve({ error: 'Session expired. Redirecting to login...' });
        }

        if (res.ok) {
          const result = await res.json();
          return resolve(result);
        } else {
          return reject(res.status as any);
        }
      } catch (e) {
        console.log(e);
        return reject(e as any);
      }
    });
  },
  deleteData: (url: string, data: any) => {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const res = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (res.status === 401 || res.status === 403) {
          handleAuthError(res.status);
          return resolve({ error: 'Session expired. Redirecting to login...' });
        }

        // console.log(await res.json());
        if (res.ok) {
          const result = await res.json();
          return resolve(result);
        } else {
          return reject(res.status as any);
        }
      } catch (e) {
        console.log(e);
        return reject(e as any);
      }
    });
  },
};
