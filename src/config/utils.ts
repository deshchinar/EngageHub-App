export const getHeaders = (image: any = false) => {
    if (image) {
        return {
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0ZWQ3MzJhMS05ZGVhLTRhYTUtYjNhNC1lYWY5MTU1ZTBkZDIiLCJ1c2VybmFtZSI6Indob2FtaSIsImV4cGlyZXNJbiI6IjM2NUQiLCJhcHBsaWNhdGlvbiI6IlByb2R1Y3QiLCJzZXNzaW9uU3RhdGUiOiJTdGFydGVkIiwiaG9zdCI6ImFwaS15dWouZXhjZWxsb25jb25uZWN0LmNvbSIsInN1YnNjcmlwdGlvbklkIjoiNjUwODc2ZWItNTBmMS00ZGI1LTg0NDMtN2FiNTA0YTNjMzY2Iiwic2Vzc2lvbklkIjoiZWIyM2E5NjgtMzJlYi00OGNhLTlhODgtYTcxZmFlYjE5MzhjIiwiaWF0IjoxNzAzODMwMDU0LCJleHAiOjE3MzUzNjYwNTR9.cYakTO6qZJXZgaC7l4t-iXlggDetnpKcv_h8reyzFRY`,
            'Content-Type': 'multipart/form-data',
        };
    } else {
        return {
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0ZWQ3MzJhMS05ZGVhLTRhYTUtYjNhNC1lYWY5MTU1ZTBkZDIiLCJ1c2VybmFtZSI6Indob2FtaSIsImV4cGlyZXNJbiI6IjM2NUQiLCJhcHBsaWNhdGlvbiI6IlByb2R1Y3QiLCJzZXNzaW9uU3RhdGUiOiJTdGFydGVkIiwiaG9zdCI6ImFwaS15dWouZXhjZWxsb25jb25uZWN0LmNvbSIsInN1YnNjcmlwdGlvbklkIjoiNjUwODc2ZWItNTBmMS00ZGI1LTg0NDMtN2FiNTA0YTNjMzY2Iiwic2Vzc2lvbklkIjoiZWIyM2E5NjgtMzJlYi00OGNhLTlhODgtYTcxZmFlYjE5MzhjIiwiaWF0IjoxNzAzODMwMDU0LCJleHAiOjE3MzUzNjYwNTR9.cYakTO6qZJXZgaC7l4t-iXlggDetnpKcv_h8reyzFRY`,
        };
    }
};