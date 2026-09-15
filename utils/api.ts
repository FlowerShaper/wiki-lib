import type { CookieRef } from "#app";

export default class API {
    static APIUrl = '';
    static CDNUrl = '';
    static TokenCookie: CookieRef<string | undefined>;
    static CurrentUser: CookieRef<WikiUser | undefined>;

    static Setup(dev: boolean) {
        this.APIUrl = dev ? 'http://localhost:1984' : 'https://backend.cametek.jp';
        this.CDNUrl = dev ? 'http://localhost:1984/cdn?path=' : 'https://cdn.cametek.jp/wiki';

        this.TokenCookie = useCookie('token', {
            sameSite: 'lax',
            maxAge: 365 * 24 * 60 * 60,
        });

        this.CurrentUser = useCookie<WikiUser>('user', {
            sameSite: 'lax',
            maxAge: 365 * 24 * 60 * 60,
        });
    }

    static async PerformGet<T, E = Error>(endpoint: string, url: string = this.APIUrl): Promise<Result<T, E>> {
        return tryPerform<T, E>(endpoint, 'GET', {}, url);
    }

    static async PerformPost<T, E = Error>(endpoint: string, body: any, url: string = this.APIUrl): Promise<Result<T, E>> {
        return tryPerform<T, E>(endpoint, 'POST', body, url);
    }

    static async PerformPatch<T, E = Error>(endpoint: string, body: any, url: string = this.APIUrl): Promise<Result<T, E>> {
        return tryPerform<T, E>(endpoint, 'PATCH', body, url);
    }

    static async PerformPut<T, E = Error>(endpoint: string, body: any = {}, url: string = this.APIUrl): Promise<Result<T, E>> {
        return tryPerform<T, E>(endpoint, 'PUT', body, url);
    }

    static async PerformDelete<T, E = Error>(endpoint: string, body: any = {}, url: string = this.APIUrl): Promise<Result<T, E>> {
        return tryPerform<T, E>(endpoint, 'DELETE', body, url);
    }

    static OpenLogin() {
        const url = `https://discord.com/oauth2/authorize?response_type=token&client_id=1290974200126771263&scope=identify&redirect_uri=${window.location.protocol}//${window.location.host}/oauth/complete`;
        const params = 'width=500,height=600,scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no';

        const popup = window.open(url, 'popup', params);

        if (!popup) throw new Error('Failed to open the pop-up.');

        window.addEventListener('message', listener);

        const heartbeat = setInterval(() => {
            if (!popup || popup.closed) {
                clear();
                throw new Error('Pop-up closed without finishing.');
            }

            popup.postMessage('bwomp', `${window.location.protocol}//${window.location.host}/`);
        }, 200);

        window.addEventListener('beforeunload', (_) => {
            if (popup && !popup.closed) popup.close();
            clear();
        });

        function listener(ev: MessageEvent<any>) {
            if (ev.data.error) throw new Error(ev.data.error);
            if (!ev.data.access_token) return;

            clear();
            popup?.close();
            console.log(ev);

            const token = ev.data.access_token;
            API.TokenCookie.value = token;
            API.RefreshInfo();
        }

        function clear() {
            clearInterval(heartbeat);
            window.removeEventListener('message', listener);
        }
    }

    static PathToSlug(path: string): string {
        if (path.startsWith('/')) path = path.substring(1);

        return path.replace(/\//gi, '-').toLowerCase();
    }

    static ResolveAsset(url: string, base: string = this.CDNUrl): string {
        if (url.startsWith('cdn://')) {
            return `${base}/${url.substring(6)}`;
        }

        return url;
    }

    static Logout() {
        API.CurrentUser.value = undefined;
        API.TokenCookie.value = undefined;
    }

    static async RefreshInfo() {
        const { data: user, error } = await API.PerformGet<WikiUser>('/users/@me');

        if (error) {
            this.Logout();
            return;
        }

        this.CurrentUser.value = user;
    }
}

async function tryPerform<T, E = Error>(endpoint: string, method: string, body: any = {}, url: string): Promise<Result<T, E>> {
    try {
        const res = await perform<T>(endpoint, method, body, url);

        if (!res.IsSuccess() || !res.data) throw new APIError(res);

        return { data: res.data, error: null };
    } catch (ex: any) {
        return { data: null, error: ex as E };
    }
}
async function perform<T>(endpoint: string, method: string, body: any = {}, url: string): Promise<APIResponse<T>> {
    const rsp = new APIResponse<T>();

    try {
        var opt = {
            baseURL: url,
            headers: createHeaders(url),
            body: undefined,
            method: method as any, // ts can be really stupid sometimes
        };

        if (method != 'GET' && body) opt.body = body;

        let { data, error } = await useFetch<APIResponse<T>>(endpoint, opt);

        if (error.value) {
            if (error.value?.data) data.value = <APIResponse<T>>error.value.data;
            else throw error.value;
        }

        if (error.value?.statusCode == 204) rsp.status = 204;
        else Object.assign(rsp, data.value);
    } catch (ex: any) {
        console.error(ex);

        rsp.status = 500;
        rsp.message = ex?.message || 'Unknown error';
    }

    return rsp;
}

function createHeaders(url: string): any {
    const headers: any = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };

    if (API.TokenCookie.value && url == api.APIUrl) {
        headers.Authorization = API.TokenCookie.value;
    }

    return headers;
}
