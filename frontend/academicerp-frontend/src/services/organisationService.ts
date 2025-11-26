import type { Organisation } from '../types/organisation'

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:8080'
const BASE = `${BACKEND_URL.replace(/\/$/, '')}/api/organisations`

function getAuthHeader(): Record<string, string> {
    try {
        const token = localStorage.getItem('auth_token')
        return token ? { Authorization: `Bearer ${token}` } : {}
    } catch {
        return {}
    }
}

async function handleResponse<T>(res: Response): Promise<T> {
    const text = await res.text()
    const contentType = res.headers.get('content-type') || ''
    const data = contentType.includes('application/json') && text ? JSON.parse(text) : text
    if (!res.ok) {
        const err = new Error((data && (data.message || JSON.stringify(data))) || res.statusText)
            ; (err as any).status = res.status
        throw err
    }
    return data as T
}

export const OrganisationService = {
    async getAll(): Promise<Organisation[]> {
        const res = await fetch(`${BASE}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(),
            },
        })
        return handleResponse<Organisation[]>(res)
    },

    async getById(id: string | number): Promise<Organisation> {
        const res = await fetch(`${BASE}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(),
            },
        })
        return handleResponse<Organisation>(res)
    },

    async create(payload: Organisation): Promise<Organisation> {
        const res = await fetch(`${BASE}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(),
            },
            body: JSON.stringify(payload),
        })
        return handleResponse<Organisation>(res)
    },

    async update(id: string | number, payload: Organisation): Promise<Organisation> {
        const res = await fetch(`${BASE}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(),
            },
            body: JSON.stringify(payload),
        })
        return handleResponse<Organisation>(res)
    },

    async remove(id: string | number): Promise<void> {
        const res = await fetch(`${BASE}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(),
            },
        })
        await handleResponse<void>(res)
    },
}

export default OrganisationService
