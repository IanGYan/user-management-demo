# 数据库配置说明  
  
## 环境变量配置  
  
请创建 .env 文件并参考以下配置：  
  
```bash  
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/user_management?schema=public"  
TYPEORM_SYNCHRONIZE=false  
TYPEORM_LOGGING=true  
TYPEORM_MIGRATIONS_RUN=true  
``` 
