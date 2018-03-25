/**
 * @file interface
 * @author Cuttle Cong
 * @date 2018/3/25
 * @description
 */
import { Prompt } from '../../types/TemplateConfig'

export type PromptProcessor = (p: Prompt) => Promise<any>
