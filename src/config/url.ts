import { Config } from "./config"

export const getFolder = `${Config.baseURL}/list_folders`
export const getSubFolder = (id: any) => `${Config.baseURL}/list_subfolders?parent_folder_id=${id}`
export const getFilesById = (id: any) => `${Config.baseURL}/list_files?folder_id=${id}`
export const processVideo =  () => `${Config.baseURL}/process_video`
export const processImage = () =>  `${Config.baseURL}/process_image`



