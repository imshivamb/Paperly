export interface RouteParams<T> {
    params: Promise<T>
  }
  
  export type IdParam = {
    id: string
  }
  
  export type SlugParam = {
    slug: string
  }