import type { PageLoad } from './$types'

function random<T>(list: Array<T>): T {
  if (list.length === 0)
    throw new Error('List is empty')

  return list[Math.floor(Math.random() * list.length)]
}

function getOffsetOf<T>(list: Array<T>, element: T, offset: number, getValue?: (item: T) => any): T {
  const elementValue = getValue ? getValue(element) : element
  const index = list.findIndex(item => getValue ? getValue(item) === elementValue : item === element)

  if (index === -1)
    throw new Error('Element not found in list')

  const nextIndex = (index + offset) % list.length
  return list[nextIndex]
}

export const load: PageLoad = () => {
  return {
    random,
    getOffsetOf,
  }
}
