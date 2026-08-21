import members from '../data/members.json'
import papers from '../data/papers.json'
import { RESEARCH_DIRECTIONS } from '../config/researchDirections'

/**
 * 全站统一动态统计（从数据文件推导，禁止硬编码数字）
 *
 * 口径：
 * - 教师：members.json 中 role === 'faculty'
 * - 在读研究生：role === 'phd' | 'master' 且 status !== 'graduated'（已毕业成员不计入）
 * - 学术论文：papers.json 条目数
 * - 研究方向：表现层配置 RESEARCH_DIRECTIONS 数量
 *
 * 页面使用：首页统计条 / 实验室介绍正文 / 团队成员页分组计数等。
 * 数据文件更新后此处数字自动跟随，无需改动页面。
 */

const isFaculty = (m) => m.role === 'faculty'
const isStudent = (m) => m.role === 'phd' || m.role === 'master'
const isCurrentStudent = (m) => isStudent(m) && m.status !== 'graduated'

export const LAB_STATS = {
  facultyCount: members.filter(isFaculty).length,
  currentStudentCount: members.filter(isCurrentStudent).length,
  paperCount: papers.length,
  directionCount: RESEARCH_DIRECTIONS.length,
}
