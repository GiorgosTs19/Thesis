import { AbstractAPI } from '@/API/AbstractAPI.js';

export class Auth extends AbstractAPI {
    async check() {
        return this.get(route('Auth.Check')).then((res) => res);
    }

    async logout() {
        this.post(route('Auth.Logout'));
    }
}
