import { ColumnProps } from './testData'

export function generateFitUrl(
  column: ColumnProps,
  width: number,
  height: number
) {
  if (column.avatar) {
    column.avatar.fitUrl =
      column.avatar.url +
      `?x-oss-process=image/resize,m_pad,h_${height},w_${width}`
  } else {
    column.avatar = {
      fitUrl: require('@/assets/column.jpg')
    }
  }
}

// 检测上传文件
interface CheckCondition {
  format?: string[]
  size?: number
}
type ErrorType = 'size' | 'format' | null

export function beforeUploadCheck(file: File, condition: CheckCondition) {
  const { format, size } = condition
  // 检测文件格式
  const isValidFormat = format ? format.includes(file.type) : true
  // 检测文件大小
  const isValidSize = size ? file.size / 1024 / 1024 < size : true
  let error: ErrorType = null

  if (!isValidFormat) {
    error = 'format'
  }
  if (!isValidSize) {
    error = 'size'
  }

  return {
    passed: isValidFormat && isValidSize,
    error
  }
}
