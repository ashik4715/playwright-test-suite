const API_BASE_URL = 'http://localhost:3000';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface Blog {
  id: number;
  title: string;
  content: string;
  authorId: number;
  author?: {
    id: number;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogDto {
  title: string;
  content: string;
}

export interface UpdateBlogDto {
  title?: string;
  content?: string;
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || 'An error occurred');
    }

    return response.json();
  }

  // Auth endpoints
  async register(data: RegisterDto): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Blog endpoints
  async getBlogs(): Promise<Blog[]> {
    return this.request<Blog[]>('/blog');
  }

  async getBlog(id: number): Promise<Blog> {
    return this.request<Blog>(`/blog/${id}`);
  }

  async createBlog(data: CreateBlogDto): Promise<Blog> {
    return this.request<Blog>('/blog', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBlog(id: number, data: UpdateBlogDto): Promise<Blog> {
    return this.request<Blog>(`/blog/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteBlog(id: number): Promise<void> {
    return this.request<void>(`/blog/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();

