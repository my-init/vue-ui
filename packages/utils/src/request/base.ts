import { logError } from '@/utils/log'
import { createFetch, type UseFetchReturn } from '@vueuse/core'
const baseEl = document.head.querySelector('base')

export const useFetch = createFetch({
  baseUrl: baseEl ? baseEl.href : '',
  options: {
    beforeFetch({ url, options, cancel }) {
      return { options }
    },
    afterFetch(ctx) {
      if (ctx.data.status === 200) {
        ctx.data = ctx.data.data || {}
      }
      return ctx
    },
    onFetchError(ctx) {
      logError(`when fetch '${ctx.response?.url}'`, ctx.error)
      return ctx
    }
  }
  // fetchOptions: {
  //     mode: 'cors',//开跨越
  //   },
})

export function useGet<T = unknown>(url: string) {
  return useFetch<T>(url).get().json<ApiResponse<T>>()
}

export function usePost<T = unknown, B = unknown>(url: string, data: B, dataType = 'json') {
  return useFetch(url).post(data, dataType).json<ApiResponse<T>>()
}

export type ApiResponse<T> = {
  success: boolean
  data: T
  error: any
}
